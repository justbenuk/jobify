import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import JobInfo from "./job-info";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJobAction } from "@/actions/job-actions";
import { useToast } from "@/hooks/use-toast";
export default function JobDeleteButton({ id }: { id: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteJobAction(id),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: "there was an error ",
        });
        console.log(id);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["states"] });
      queryClient.invalidateQueries({ queryKey: ["charts"] });
      toast({
        description: "Job Removed",
      });
    },
  });
  return (
    <Button size="sm" disabled={isPending} onClick={() => mutate(id)}>
      {isPending ? "Deleting..." : "delete"}
    </Button>
  );
}
