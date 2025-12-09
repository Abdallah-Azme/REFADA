"use client";

import { X, ImagePlus } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string; // Container class
  imageClassName?: string; // Image wrapper class
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  className,
  imageClassName,
  placeholder = "Upload Image",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    if (typeof value === "string") {
      setPreview(value);
    } else if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);

      // Cleanup
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [value]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onChange(file);
      }
    },
    [onChange]
  );

  const handleRemove = useCallback(() => {
    onChange(null);
    if (onRemove) {
      onRemove();
    }
  }, [onChange, onRemove]);

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {preview ? (
        <div
          className={`relative overflow-hidden rounded-md border ${
            imageClassName || "h-40 w-40"
          }`}
        >
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <Button
            type="button"
            onClick={handleRemove}
            variant="destructive"
            size="icon"
            className="absolute right-1 top-1 h-6 w-6"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 ${
            imageClassName || "h-40 w-40"
          }`}
        >
          <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2">
            <ImagePlus className="h-8 w-8 text-gray-400" />
            <span className="text-xs text-gray-500">{placeholder}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled}
            />
          </label>
        </div>
      )}
    </div>
  );
}
