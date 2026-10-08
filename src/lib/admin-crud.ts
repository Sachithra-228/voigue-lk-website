/* Mongoose's model typings are too generic to share across collections here, so the model is loosely typed. */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { ZodTypeAny } from "zod";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";

type Ctx = { params: Promise<{ id: string }> };

type Options = {
  model: any;
  schema: ZodTypeAny;
  /** Refreshes the public pages that show this content. */
  revalidate: () => void;
  /** Adjusts validated data before saving (e.g. stamping a publish date). `existing` is set on updates. */
  prepare?: (data: any, existing?: any) => any;
  label: string;
};

const json = (body: unknown, status = 200) => NextResponse.json(body, { status });

/** Admin-only create / update / delete handlers shared by voices, gallery moments and blog posts. */
export function crudHandlers({ model, schema, revalidate, prepare, label }: Options) {
  async function parse(request: Request) {
    const parsed = schema.safeParse(await request.json().catch(() => null));
    return parsed.success
      ? { data: parsed.data as any }
      : { error: json({ error: parsed.error.issues[0]?.message ?? `Invalid ${label}` }, 400) };
  }

  function failure(error: unknown, action: string) {
    const duplicate = (error as { code?: number }).code === 11000;
    return json({ error: duplicate ? "Another item already uses this slug" : `Could not ${action} the ${label}` }, duplicate ? 409 : 400);
  }

  return {
    async create(request: Request) {
      if (!(await requireAdmin())) return json({ error: "Unauthorized" }, 401);
      const { data, error } = await parse(request);
      if (error) return error;
      try {
        await connectToDatabase();
        const doc = await model.create(prepare ? prepare(data) : data);
        revalidate();
        return json(doc, 201);
      } catch (caught) {
        return failure(caught, "save");
      }
    },

    async update(request: Request, { params }: Ctx) {
      if (!(await requireAdmin())) return json({ error: "Unauthorized" }, 401);
      const { data, error } = await parse(request);
      if (error) return error;
      const { id } = await params;
      try {
        await connectToDatabase();
        const existing = await model.findById(id).lean();
        if (!existing) return json({ error: "Not found" }, 404);
        const doc = await model.findByIdAndUpdate(id, prepare ? prepare(data, existing) : data, { new: true });
        revalidate();
        return json(doc);
      } catch (caught) {
        return failure(caught, "update");
      }
    },

    async remove(_: Request, { params }: Ctx) {
      if (!(await requireAdmin())) return json({ error: "Unauthorized" }, 401);
      const { id } = await params;
      try {
        await connectToDatabase();
        await model.findByIdAndDelete(id);
        revalidate();
        return json({ ok: true });
      } catch {
        return json({ error: `Could not delete the ${label}` }, 400);
      }
    }
  };
}
