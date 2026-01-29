// lib/s3-upload.ts

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export async function uploadFileToS3(
  file: File,
  folder: string = "uploads",
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    console.log("🚀 Starting upload for:", file.name);
    onProgress?.(10);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    console.log("📡 Sending to /api/upload");

    // 🔧 Upload to Next.js API (server handles S3 upload)
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    console.log("📥 Response status:", response.status);
    console.log("📥 Response headers:", response.headers);

    onProgress?.(50);

    // 🔧 Check if response is OK
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      
      if (contentType?.includes("application/json")) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      } else {
        const text = await response.text();
        throw new Error(text || `Upload failed with status ${response.status}`);
      }
    }

    // 🔧 Parse JSON response
    const contentType = response.headers.get("content-type");
    
    if (!contentType?.includes("application/json")) {
      const text = await response.text();
      console.error("❌ Unexpected response type:", contentType);
      console.error("❌ Response body:", text);
      throw new Error(`Unexpected response format: ${contentType}`);
    }

    const data = await response.json();
    console.log("✅ Upload response:", data);

    if (!data.success) {
      throw new Error(data.error || "Upload failed");
    }

    onProgress?.(100);

    console.log("✅ File uploaded successfully:", data.url);

    return {
      success: true,
      url: data.url,
      key: data.key,
    };
  } catch (error: any) {
    console.error("❌ Upload error:", error.message);
    return {
      success: false,
      error: error.message || "Upload failed",
    };
  }
}
