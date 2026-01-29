// components/content/EditForm.tsx
"use client";

import Button from "@/components/common/Button";
import ImageWithSkeleton from "@/components/common/ImageWithSkaleton";
import Input from "@/components/common/Input";
import { useUpdateContent } from "@/hooks/content";
import { notify } from "@/lib/toast";
import { ChangeEvent, useState } from "react";
import Loader from "../common/Loader";
import { Content } from "@/types/content";

// 🔧 NEW: Type for visibility
type VisibilityType = "public" | "restricted";

export default function EditForm({
  content,
  onClose,
}: {
  content: Content | null;
  onClose: () => void;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(
    content?.image || null
  );
  const [videoSrc, setVideoSrc] = useState<string | null>(
    content?.video || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [title, setTitle] = useState(content?.title || "");
  const [description, setDescription] = useState(content?.description || "");
  // 🔧 FIXED: Properly typed visibility state
  const [visibility, setVisibility] = useState<VisibilityType>(
    (content?.visibility as VisibilityType) || "public"
  );

  const updateMutation = useUpdateContent();

  // 🔧 UPDATED: Handle image upload separately
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = files?.[0];

    if (!file) {
      setImageSrc(content?.image || null);
      setImageFile(null);
      return;
    }

    const preview = URL.createObjectURL(file);
    setImageSrc(preview);
    setImageFile(file);
  };

  // 🔧 UPDATED: Handle video upload separately (doesn't affect image)
  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = files?.[0];

    if (!file) {
      setVideoSrc(content?.video || null);
      setVideoFile(null);
      return;
    }

    const preview = URL.createObjectURL(file);
    setVideoSrc(preview);
    setVideoFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content) return;

    updateMutation.mutate(
      {
        id: content._id,
        formData: {
          title,
          description,
          visibility,
          image: imageFile || undefined,
          video: videoFile || undefined,
        },
      },
      {
        onSuccess: () => {
          notify.success("Content updated successfully");
          onClose();
        },
        onError: (error) => {
          notify.error(error?.message || "Failed to update");
        },
      }
    );
  };

  const isPending = updateMutation.isPending;

  // 🔧 NEW: Type-safe visibility change handler
  const handleVisibilityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as VisibilityType;
    setVisibility(value);
  };

  return (
    <div className="fixed top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg w-full md:w-150 z-100 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold text-foreground">Edit Content</h2>
      <div className="py-2">
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            name="title"
            placeholder="Enter your title"
            onChange={(newValue) => setTitle(newValue)}
            value={title}
            type="text"
            label="Title"
          />
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              className="border h-50 border-gray-300 resize-none rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="visibility"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Visibility
            </label>
            <select
              id="visibility"
              name="visibility"
              value={visibility}
              onChange={handleVisibilityChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
            >
              <option value="public">Public</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="flex items-center gap-3">
            <ImageWithSkeleton src={imageSrc} />
            <div className="flex-1">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                name="image"
                id="image"
                onChange={handleImageChange}
                disabled={isPending}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent disabled:opacity-50"
              />
              {imageFile && (
                <p className="text-xs text-green-600 mt-1">
                  ✅ {imageFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div className="flex items-center gap-3">
            <div className="h-20 w-20 min-w-20">
              <video
                className="w-20 h-20 bg-gray-100"
                muted
                src={videoSrc || undefined}
                preload="metadata"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="video"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Video (Optional)
              </label>
              <input
                type="file"
                name="video"
                id="video"
                accept="video/*"
                onChange={handleVideoChange}
                disabled={isPending}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent disabled:opacity-50"
              />
              {videoFile && (
                <p className="text-xs text-green-600 mt-1">
                  ✅ {videoFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="submit"
              title="Submit"
              leftIcon={isPending ? <Loader /> : null}
              disabled={isPending}
              className="bg-foreground text-background text-sm flex items-center"
            />
            <Button
              type="button"
              title="Cancel"
              onClick={onClose}
              className="bg-red-500 text-background text-sm ml-2"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
