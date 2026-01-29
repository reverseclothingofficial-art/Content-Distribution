// lib/s3-delete.ts

export interface DeleteResult {
  success: boolean;
  error?: string;
}

// 🔧 Delete file from S3
export async function deleteFromS3(s3Key: string): Promise<DeleteResult> {
  try {
    const response = await fetch("/api/s3/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: s3Key }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete file");
    }

    const data = await response.json();
    console.log("✅ File deleted from S3:", s3Key);
    return data;
  } catch (error: any) {
    console.error("❌ S3 delete error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// 🔧 Extract S3 key from URL
export function extractS3Key(s3Url: string): string {
  try {
    const url = new URL(s3Url);
    return url.pathname.substring(1); // Remove leading slash
  } catch {
    return "";
  }
}

// 🔧 Delete image and video from S3
export async function deleteContentFiles(
  imageUrl?: string,
  videoUrl?: string
): Promise<DeleteResult> {
  try {
    const deleteTasks = [];

    if (imageUrl) {
      const imageKey = extractS3Key(imageUrl);
      if (imageKey) {
        console.log("🗑️ Deleting image:", imageKey);
        deleteTasks.push(deleteFromS3(imageKey));
      }
    }

    if (videoUrl) {
      const videoKey = extractS3Key(videoUrl);
      if (videoKey) {
        console.log("🗑️ Deleting video:", videoKey);
        deleteTasks.push(deleteFromS3(videoKey));
      }
    }

    if (deleteTasks.length === 0) {
      return { success: true };
    }

    const results = await Promise.all(deleteTasks);

    // Check if any deletion failed
    const failed = results.find((r) => !r.success);
    if (failed) {
      return {
        success: false,
        error: failed.error,
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error("❌ Content files delete error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
