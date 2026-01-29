// lib/api/content.client.ts
import { Content } from "@/types/content";
import { api } from "./client";
import { uploadFileToS3 } from "@/lib/api/s3-upload";
import { deleteContentFiles } from "@/lib/api/s3-delete";
import { CreateContentPayload, UpdateContentPayload } from "@/hooks/content";

const BASE = "/api/content";

export function getContentList(
  page = 1
): Promise<{ items: Content[]; total: number }> {
  return api(`${BASE}?page=${page}&limit=10`);
}

export function getContent(id: string): Promise<Content> {
  return api<Content>(`${BASE}/${id}`, {
    method: "GET",
  });
}

export async function deleteContent(id: string): Promise<void> {
  try {
    console.log("📡 Fetching content details for deletion...");
    const content = await getContent(id);

    if (content.image || content.video) {
      console.log("🗑️ Deleting files from S3...");
      const deleteResult = await deleteContentFiles(
        content.image,
        content.video
      );

      if (!deleteResult.success) {
        console.warn("⚠️ S3 deletion warning:", deleteResult.error);
      }
    }

    console.log("🗑️ Deleting content from database...");
    return api<void>(`${BASE}/${id}`, {
      method: "DELETE",
    });
  } catch (error: any) {
    console.error("❌ Delete content error:", error);
    throw error;
  }
}

// 🔧 SIMPLIFIED: Use new upload API
export async function createContent(
  payload: CreateContentPayload
): Promise<Content> {
  try {
    const { title, description, visibility = "public", image, video } = payload;

    if (!title || !image) {
      throw new Error("Title and image are required");
    }

    // 🔧 Upload image through Next.js API
    console.log("📤 Uploading image...");
    const imageResult = await uploadFileToS3(image, "images");
    if (!imageResult.success) {
      throw new Error(imageResult.error || "Image upload failed");
    }

    let videoUrl = "";
    // 🔧 Upload video through Next.js API if provided
    if (video) {
      console.log("📤 Uploading video...");
      const videoResult = await uploadFileToS3(video, "videos");
      if (!videoResult.success) {
        throw new Error(videoResult.error || "Video upload failed");
      }
      videoUrl = videoResult.url!;
    }

    // 🔧 Send JSON to Express backend
    const jsonPayload = {
      title,
      description,
      image: imageResult.url!,
      video: videoUrl || undefined,
      visibility,
    };

    console.log("📡 Sending to backend:", jsonPayload);

    return api<Content>(BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonPayload),
    });
  } catch (error: any) {
    console.error("❌ Create content error:", error);
    throw error;
  }
}

export async function updateContent(
  id: string,
  payload: UpdateContentPayload
): Promise<Content> {
  try {
    const { title, description, visibility, image, video } = payload;

    const jsonPayload: any = {
      title,
      description,
      visibility,
    };

    // 🔧 Upload new image if provided
    if (image) {
      console.log("📤 Uploading new image...");
      const imageResult = await uploadFileToS3(image, "images");
      if (!imageResult.success) {
        throw new Error(imageResult.error || "Image upload failed");
      }
      jsonPayload.image = imageResult.url;
    }

    // 🔧 Upload new video if provided
    if (video) {
      console.log("📤 Uploading new video...");
      const videoResult = await uploadFileToS3(video, "videos");
      if (!videoResult.success) {
        throw new Error(videoResult.error || "Video upload failed");
      }
      jsonPayload.video = videoResult.url;
    }

    console.log("📡 Sending update to backend:", jsonPayload);

    return api<Content>(`${BASE}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonPayload),
    });
  } catch (error: any) {
    console.error("❌ Update content error:", error);
    throw error;
  }
}
