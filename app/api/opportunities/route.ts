import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type");
  const country = searchParams.get("country");
  const status = searchParams.get("status") || "open";

  let query = supabase
    .from("opportunities")
    .select("*, creator:profiles(first_name, last_name, avatar_url)")
    .eq("status", status);

  if (type) query = query.eq("type", type);
  if (country) query = query.eq("country", country);

  const { data, error } = await query.order("created_at", { ascending: false }).limit(50);

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
    .from("opportunities")
    .insert([{ ...body, creator_id: user.id }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data?.[0], { status: 201 });
}
