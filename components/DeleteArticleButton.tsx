"use client";

import React, { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteArticle } from "@/app/admin/actions";

interface DeleteArticleButtonProps {
  id: string;
}

export default function DeleteArticleButton({ id }: DeleteArticleButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this article/blog?")) {
      startTransition(async () => {
        try {
          await deleteArticle(id);
        } catch (err) {
          console.error("Failed to delete article:", err);
          alert("Failed to delete article. Please try again.");
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-950/20 border border-rose-900/40 hover:bg-rose-950/45 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer disabled:opacity-40"
      title="Delete Article"
    >
      <Trash2 className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
    </button>
  );
}
