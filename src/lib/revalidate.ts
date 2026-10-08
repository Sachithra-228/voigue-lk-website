import { revalidatePath } from "next/cache";

/** Pages that show vacancies; refreshed immediately when the Talent Acquisition team edits a job. */
export function revalidateCareers() {
  revalidatePath("/");
  revalidatePath("/careers");
}

export function revalidateLife() {
  revalidatePath("/life-at-voigue");
}

export function revalidateBlog() {
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
}
