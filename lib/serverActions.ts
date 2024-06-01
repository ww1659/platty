"use server";

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supaCheckIsAdmin, supaGetCommunitiesWhereAdmin } from "./queries";

export async function supaLogout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error);
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function supaLogin(formData: FormData) {
  const supabase = createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function supaSignup(formData: FormData) {
  const supabase = createClient();

  const inputData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
  };

  const { data, error: signupError } = await supabase.auth.signUp(inputData);

  const user = data.user;

  if (signupError || !user) {
    console.error("Signup error:", signupError);
    redirect("/error");
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    first_name: inputData.firstName,
    last_name: inputData.lastName,
  });

  if (profileError) {
    console.error("Profile creation error:", profileError);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function checkAdminStatus(userId: string): Promise<boolean> {
  return await supaCheckIsAdmin(userId);
}

export async function getCommunitiesForAdmins(userId: string) {
  return await supaGetCommunitiesWhereAdmin(userId);
}
