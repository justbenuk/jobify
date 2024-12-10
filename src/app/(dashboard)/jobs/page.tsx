import JobList from "@/components/job/job-list";
import JobSearch from "@/components/job/job-search";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { getAllJobsAction } from "@/actions/job-actions";
export default async function JobsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["jobs", "", "all", 1],
    queryFn: () => getAllJobsAction({}),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JobSearch />
      <JobList />
    </HydrationBoundary>
  );
}
