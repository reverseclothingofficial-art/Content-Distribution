// components/content/CreateForm.tsx
"use client";
import Button from "@/components/common/Button";
import ImageWithSkeleton from "@/components/common/ImageWithSkaleton";
import Input from "@/components/common/Input";
import Loader from "@/components/common/Loader";
import { useCreateContent } from "@/hooks/content";
import { notify } from "@/lib/toast";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

// 🔧 NEW: Type for visibility
type VisibilityType = "public" | "restricted";

export default function CreateContent() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<VisibilityType>("public");

  const createMutation = useCreateContent();

  // 🔧 UPDATED: Handle image upload separately
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = files?.[0];

    if (!file) {
      setImageSrc(null);
      setImageFile(null);
      return;
    }

    const preview = URL.createObjectURL(file);
    setImageSrc(preview);
    setImageFile(file);
  };

  // 🔧 UPDATED: Handle video upload separately
  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = files?.[0];

    if (!file) {
      setVideoSrc(null);
      setVideoFile(null);
      return;
    }

    const preview = URL.createObjectURL(file);
    setVideoSrc(preview);
    setVideoFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !imageFile) {
      notify.error("Title and image are required");
      return;
    }

    createMutation.mutate(
      {
        title,
        description,
        visibility,
        image: imageFile,
        video: videoFile || undefined, // 🔧 Video is optional
      },
      {
        onSuccess: () => {
          notify.success("Content created successfully");
          setTitle("");
          setDescription("");
          setImageSrc(null);
          setVideoSrc(null);
          setImageFile(null);
          setVideoFile(null);
        },
        onError: (error) => {
          const err = error.message || "Something went wrong";
          notify.error(err);
        },
      }
    );
  };

  const isPending = createMutation.isPending;

  const handleVisibilityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as VisibilityType;
    setVisibility(value);
  };

  // 🔧 Check if form is valid
  const isFormValid = title.trim() !== "" && imageFile !== null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground">Create Content</h2>
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

          {/* 🔧 IMAGE UPLOAD - Required */}
          <div className="flex items-center gap-3">
            <ImageWithSkeleton src={imageSrc} />
            <div className="flex-1">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Image <span className="text-red-500">*</span>
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
                  ✅ {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)}MB)
                </p>
              )}
            </div>
          </div>

          {/* 🔧 VIDEO UPLOAD - Optional */}
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
                Video <span className="text-gray-400 text-xs">(Optional)</span>
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
                  ✅ {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)}MB)
                </p>
              )}
            </div>
          </div>

          {/* 🔧 Both file info */}
          {imageFile && videoFile && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-sm text-blue-700">
                ✅ Both image and video selected and ready to upload!
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              type="submit"
              title={isPending ? "Uploading..." : "Submit"}
              leftIcon={isPending ? <Loader /> : null}
              disabled={isPending || !isFormValid}
              className={`text-sm flex items-center ${
                isFormValid && !isPending
                  ? "bg-foreground text-background cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
              }`}
            />
            <Link
              className="bg-background text-foreground text-sm flex items-center gap-2 cursor-pointer shadow-[inset_0_-1px_5px_rgba(0,0,0,0.2)] rounded-sm border p-2.5"
              href={"/content"}
            >
              Back
            </Link>
          </div>

          {/* Helper text */}
          {!isFormValid && (
            <div className="text-xs text-red-500 mt-2">
              {!title.trim() && <p>• Please enter a title</p>}
              {!imageFile && <p>• Please select an image</p>}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
