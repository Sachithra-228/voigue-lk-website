import { NextResponse } from "next/server";
import { posts } from "@/lib/admin-resources";
import { getPosts } from "@/lib/query";

export async function GET() {
  return NextResponse.json(await getPosts());
}

export const POST = posts.create;
