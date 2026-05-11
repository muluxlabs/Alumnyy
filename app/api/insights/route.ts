import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const country = searchParams.get("country");
  const industry = searchParams.get("industry");

  let query = supabase
    .from("market_insights")
    .select("*, creator:profiles(first_name, last_name, avatar_url)")
    .eq("visibility", "public");

  if (country) query = query.eq("country", country);
  if (industry) query = query.eq("industry", industry);

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("market_insights")
    .insert([{ ...body, creator_id: user.id }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data?.[0], { status: 201 });
}
