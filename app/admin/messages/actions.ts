"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function assertAdmin() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("Non autorisé");
}

export async function setMessageStatus(formData: FormData) {
  await assertAdmin();

  const id = String(formData.get("id") ?? "");
  const status = formData.get("status") === "handled" ? "handled" : "new";

  const { error } = await supabaseAdmin
    .from("contact_messages")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");
}

export async function deleteMessage(formData: FormData) {
  await assertAdmin();

  const id = String(formData.get("id") ?? "");
  const { error } = await supabaseAdmin.from("contact_messages").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");
}
