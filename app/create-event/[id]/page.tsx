import { createClient } from "@/supabase/server";

export default async function CreateEventPage() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    <h3>Supabase Error: {error.message}</h3>;
  }

  return (
    <main className="flex min-h-screen flex-col items-start justify-start">
      <div className="container mt-5">
        <h3>Create a new event for your team</h3>
        <div className="flex justify-center flex-row flex-wrap gap-5 my-5"></div>
      </div>
    </main>
  );
}
