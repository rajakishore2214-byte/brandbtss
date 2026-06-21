"use client";

import React, { useState } from "react";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadInputProps {
  defaultValue?: string;
  name?: string;
}

export default function ImageUploadInput({ defaultValue = "", name = "image" }: ImageUploadInputProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to upload image");
      }

      const data = await res.json();
      if (data.url) {
        setUrl(data.url);
      } else {
        throw new Error("No URL returned from upload server");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        {/* URL Input */}
        <div className="flex-1 w-full space-y-1.5">
          <label htmlFor={name} className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Image Path / URL
          </label>
          <input
            type="text"
            id={name}
            name={name}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. /images/web_hosting.png or upload a local file"
            required
            className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
          />
        </div>

        {/* File Upload Button */}
        <div className="w-full sm:w-auto">
          <label className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-slate-905 border border-slate-800 hover:border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 cursor-pointer transition-colors w-full">
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 text-emerald-500" />
                Upload Image
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

      {/* Preview */}
      {url && (
        <div className="mt-2 flex items-center gap-4 p-3 rounded-xl bg-slate-900/60 border border-slate-850 max-w-md">
          <div className="h-12 w-12 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
            <img src={url} alt="Preview" className="h-full w-full object-cover" onError={(e) => {
              // Hide preview if image fails to load (e.g. relative path on local dev)
              (e.target as HTMLElement).style.display = "none";
            }} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Image Preview</span>
            <span className="text-xs text-slate-300 block truncate">{url}</span>
          </div>
        </div>
      )}
    </div>
  );
}
