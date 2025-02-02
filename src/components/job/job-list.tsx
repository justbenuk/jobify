"use client";
import Jobcard from "./job-card";
import { useSearchParams } from "next/navigation";
import { getAllJobsAction } from "@/actions/job-actions";
import { useQuery } from "@tanstack/react-query";
import { Dice1 } from "lucide-react";

export default function JobList() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const jobStatus = searchParams.get("jobstatus") || "all";

  const pageNumber = Number(searchParams.get("page")) || 1;

  const { data, isPending } = useQuery({
    queryKey: ["jobs", search ?? "", jobStatus, pageNumber],
    queryFn: () => getAllJobsAction({ search, jobStatus, page: pageNumber }),
  });

  const jobs = data?.jobs || [];

  if (isPending) return <h2 className="text-xl">Please Wait...</h2>;

  if (jobs.length < 1) <h2 className="text-xl">No Jobs Found...</h2>;

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8">
        {jobs.map((job) => {
          return <Jobcard key={job.id} job={job} />;
        })}
      </div>
    </>
  );
}
