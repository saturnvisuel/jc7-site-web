"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteMessage } from "@/app/admin/messages/actions";

export function DeleteMessageButton({ id, author }: { id: string; author: string }) {
  return (
    <form
      action={deleteMessage}
      onSubmit={(event) => {
        if (!confirm(`Supprimer définitivement le message de ${author} ?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" size="sm" variant="ghost" className="text-red-600 hover:bg-red-50">
        <Trash2 className="mr-2 h-4 w-4" />
        Supprimer
      </Button>
    </form>
  );
}
