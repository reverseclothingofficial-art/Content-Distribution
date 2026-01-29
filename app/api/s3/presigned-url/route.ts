// api/s3/presigned-url/route.ts
import { NextResponse, NextRequest } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType, folder = "uploads" } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "Missing fileName or fileType" },
        { status: 400 }
      );
    }

    // 🔧 Generate unique key
    const timestamp = Date.now();
    const uniqueName = `${timestamp}-${Math.random()
      .toString(36)
      .substr(2, 9)}-${fileName}`;
    const key = `${folder}/${uniqueName}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
      Expires: 3600, // 1 hour
      ACL: "public-read" as const,
    };

    // 🔧 Generate pre-signed URL for upload
    const presignedUrl = await s3.getSignedUrlPromise("putObject", params);

    // 🔧 Use CloudFront URL instead of S3 direct URL!
    const cloudFrontUrl = `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${key}`;

    return NextResponse.json({
      success: true,
      presignedUrl,
      s3Key: key,
      s3Url: cloudFrontUrl, // 🔧 CloudFront URL (no CORS needed!)
    });
  } catch (error: any) {
    console.error("❌ Pre-signed URL error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate pre-signed URL",
      },
      { status: 500 }
    );
  }
}

// 🔧 Handle OPTIONS for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "3600",
      },
    }
  );
}
