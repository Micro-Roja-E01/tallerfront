"use client";

import { useEffect, useState } from "react";

type UseImageInputParams = {
  value: File[];
  onChange: (files: File[]) => void;
  onBlur?: () => void;
};

export function useImageInput({
  value,
  onChange,
  onBlur,
}: UseImageInputParams) {
  // State
  const [previews, setPreviews] = useState<string[]>([]);

  // Effects
  useEffect(() => {
    const validFiles = value.filter(file => file instanceof File);
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(urls);

    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [value]);

  // Computed values
  const totalSize = value.reduce((sum, file) => sum + file.size, 0);

  // Helpers
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Actions
  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    if (files.length === 0) {
      onBlur?.();
      return;
    }

    onChange([...value, ...Array.from(files)]);
    onBlur?.();
  };

  const removeImage = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
    onBlur?.();
  };

  const removeAll = () => {
    onChange([]);
    onBlur?.();
  };

  return {
    // Preview state
    previews,

    // Computed values
    totalSize,

    // Actions
    actions: {
      handleFiles,
      removeImage,
      removeAll,
      formatFileSize,
    },
  };
}
