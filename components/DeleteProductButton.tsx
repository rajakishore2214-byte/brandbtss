"use client";

import React, { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/actions";

interface DeleteProductButtonProps {
  id: string;
}

export default function DeleteProductButton({ id }: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      startTransition(async () => {
        try {
          await deleteProduct(id);
        } catch (err) {
          console.error("Failed to delete product:", err);
          alert("Failed to delete product. Please try again.");
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-950/20 border border-rose-900/40 hover:bg-rose-950/45 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer disabled:opacity-40"
      title="Delete Product"
    >
      <Trash2 className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
    </button>
  );
}
