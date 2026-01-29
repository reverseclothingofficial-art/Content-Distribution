// api/s3/delete/route.ts
import { NextResponse, NextRequest } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();

    if (!key) {
      return NextResponse.json(
        { error: "Missing S3 key" },
        { status: 400 }
      );
    }

    // 🔧 Validate key format
    if (!key.startsWith("images/") && !key.startsWith("videos/")) {
      return NextResponse.json(
        { error: "Invalid S3 key format" },
        { status: 400 }
      );
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    };

    // 🔧 Delete from S3
    await s3.deleteObject(params).promise();

    console.log("✅ Deleted from S3:", key);

    return NextResponse.json({
      success: true,
      message: "File deleted from S3",
      key,
    });
  } catch (error: any) {
    console.error("❌ S3 delete error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete file",
      },
      { status: 500 }
    );
  }
}
