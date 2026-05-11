import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const industry = searchParams.get("industry");
  const profileType = searchParams.get("profileType");

  let query = supabase
    .from("profiles")
    .select("*")
    .neq("id", user.id)
    .eq("visibility", "public");

  if (country) query = query.eq("country", country);
  if (industry) query = query.eq("industry", industry);
  if (profileType) query = query.eq("profile_type", profileType);

  const { data, error } = await query.limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
