"use client";

import React from "react";
import Image from "next/image";

type Props = {
  src?: string | null;
  alt?: string;
  className?: string; // wrapper size classes e.g. "h-20 w-20"
};

export default function ImageWithSkeleton({ 
  src, 
  alt = "", 
  className = "h-20 w-20 min-w-20" 
}: Props) {
  const [loaded, setLoaded] = React.useState(false);
  const hasSrc = Boolean(src);

  return (
    <div className={`relative overflow-hidden ${className} rounded-md bg-gray-50`}>
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="h-full w-full bg-gray-200 animate-pulse rounded-md" />
        </div>
      )}

      {hasSrc ? (
        <Image
          src={src as string}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100px, (max-width: 1024px) 200px, 300px"
          onLoad={() => setLoaded(true)}
          className={`object-cover transition-opacity duration-200 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        <div className="flex items-center z-0 justify-center h-full w-full text-xs text-gray-400 bg-gray-50">
          No Image
        </div>
      )}
    </div>
  );
}
