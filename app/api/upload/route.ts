// api/upload/route.ts
import { NextResponse, NextRequest } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

export async function POST(req: NextRequest) {
  try {
    console.log("📥 Upload request received");

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    console.log("📦 File info:", {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      folder,
    });

    if (!file) {
      console.error("❌ No file provided");
      return NextResponse.json(
        { success: false, error: "File is required" },
        { status: 400 }
      );
    }

    // 🔧 Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("✅ File converted to buffer:", buffer.length, "bytes");

    // 🔧 Generate unique key
    const timestamp = Date.now();
    const uniqueName = `${timestamp}-${Math.random()
      .toString(36)
      .substr(2, 9)}-${file.name}`;
    const key = `${folder}/${uniqueName}`;

    console.log("🔑 S3 Key:", key);

    // 🔧 Upload to S3 using AWS SDK (server-side)
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    };

    console.log("📤 Uploading to S3...");
    await s3.upload(params).promise();
    console.log("✅ File uploaded to S3:", key);

    // 🔧 Return CloudFront URL
    const cloudFrontUrl = `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${key}`;

    const responseData = {
      success: true,
      url: cloudFrontUrl,
      key,
    };

    console.log("✅ Sending response:", responseData);

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error("❌ Upload error:", error);
    const errorMessage = error.message || "Upload failed";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
