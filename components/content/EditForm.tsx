"use client";

import Button from "@/components/common/Button";
import ImageWithSkeleton from "@/components/common/ImageWithSkaleton";
import Input from "@/components/common/Input";
import { useUpdateContent } from "@/hooks/content";
import { notify } from "@/lib/toast";
import { ChangeEvent, useState } from "react";
import Loader from "../common/Loader";
import { Content } from "@/types/content";

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

  const [title, setTitle] = useState(content?.title || "");
  const [description, setDescription] = useState(content?.description || "");
  const [visibility, setVisibility] = useState("public");

  const updateMutation = useUpdateContent();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = files?.[0];

    if (!file) {
      setImageSrc(null);
      setVideoSrc(null);
      return;
    }

    const preview = URL.createObjectURL(file);

    if (file.type.startsWith("image/")) {
      setImageSrc(preview);
    } else if (file.type.startsWith("video/")) {
      setVideoSrc(preview);
    } else {
      setImageSrc(null);
      setVideoSrc(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("visibility", visibility);

    const imageFile = (document.getElementById("image") as HTMLInputElement)
      ?.files?.[0];
    const videoFile = (document.getElementById("video") as HTMLInputElement)
      ?.files?.[0];

    if (imageFile) form.append("image", imageFile);
    if (videoFile) form.append("video", videoFile);

    if (!content) return;

    updateMutation.mutate(
      {
        id: content?._id,
        formData: form,
      },
      {
        onSuccess: () => {
          notify.success("Content updated successfully");
          setTitle("");
          setDescription("");
          setImageSrc(null);
          setVideoSrc(null);
          onClose();
        },
      }
    );
  };
  const isPending = updateMutation.isPending;
  return (
    <div className="fixed top-[50%] translate-[-50%] left-1/2 transform bg-white p-6 rounded shadow-lg w-full md:w-150 z-100">
      <h2 className="text-xl font-semibold text-foreground">Create Content</h2>
      <div className="py-2">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          method="POST"
          className="space-y-2"
        >
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
              Visiblity
            </label>

            <select
              id="visibility"
              name="visibility"
              value={visibility}
              onChange={(e)=>setVisibility(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
            >
              <option value="public">Public</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <ImageWithSkeleton src={imageSrc} />
            <div>
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
                onChange={handleFileChange}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-20 w-20 min-w-20">
              <video
                className="w-20 h-20 bg-gray-100"
                muted
                src={videoSrc || undefined}
                preload="metadata"
              />
            </div>
            <div>
              <label
                htmlFor="video"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Video
              </label>
              <input
                type="file"
                name="video"
                id="video"
                accept="video/*"
                onChange={handleFileChange}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
              />
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
