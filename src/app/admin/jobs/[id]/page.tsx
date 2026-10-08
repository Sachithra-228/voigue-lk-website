import { assertAdmin } from "@/lib/admin-guard";
import { notFound } from "next/navigation";
import { JobForm, type JobFormValues } from "@/components/admin/JobForm";
import { connectToDatabase } from "@/lib/mongodb";
import Job from "@/models/Job";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  await assertAdmin();
  const { id } = await params;
  let job: JobFormValues | null = null;
  try {
    await connectToDatabase();
    const doc = await Job.findById(id).lean();
    job = doc ? JSON.parse(JSON.stringify(doc)) : null;
  } catch {
    job = null;
  }
  if (!job) notFound();

  return (
    <>
      <h1 className="text-4xl font-semibold">Edit job</h1>
      <JobForm job={job} />
    </>
  );
}
