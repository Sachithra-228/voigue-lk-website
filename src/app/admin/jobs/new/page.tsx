import { assertAdmin } from "@/lib/admin-guard";
import { JobForm } from "@/components/admin/JobForm";

export default async function NewJobPage() {
  await assertAdmin();
  return (
    <>
      <h1 className="text-4xl font-semibold">Add job</h1>
      <JobForm />
    </>
  );
}
