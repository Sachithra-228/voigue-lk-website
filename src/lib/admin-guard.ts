import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

/** Call at the top of every admin page: layouts are not re-rendered on client navigation, so each page checks the session itself. */
export async function assertAdmin() {
  if (!(await requireAdmin())) redirect("/admin");
}
