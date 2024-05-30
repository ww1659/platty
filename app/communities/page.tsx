import CommunityCard from "@/components/CommunityCard";
import { supaGetAllCommunities, supaGetCommunityMembers } from "@/lib/queries";
import { createClient } from "@/supabase/server";

export default async function CommunitiesPage() {
  const communities = await supaGetAllCommunities();
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    <h3>Supabase Error: {error.message}</h3>;
  }

  return (
    <main className="flex min-h-screen flex-col items-start justify-start">
      <div className="container mt-5">
        <h3>Hello. This is the communities page.</h3>
        <div className="flex justify-center flex-row flex-wrap gap-5 my-5">
          {communities &&
            communities.map((community) => (
              <div key={community.id}>
                <CommunityCard
                  id={community.id}
                  name={community.name}
                  description={community.description}
                />
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
