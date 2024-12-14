"use client";
import { useQuery } from "@tanstack/react-query";
import { getStatsAction } from "@/actions/stats-actions";
import { Statscards } from "./stats-cards";

export default function StatsContainer() {
  const { data } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getStatsAction(),
  });

  const { pending, interview, declined } = data as any;

  return (
    <div className="grid md:grid-cols-2 gap-4 lg:grid-cols-2">
      <Statscards title="pending jobs" value={pending || 0} />
      <Statscards title="interviews set" value={interview || 0} />
      <Statscards title="jobs declined" value={declined || 0} />
    </div>
  );
}
