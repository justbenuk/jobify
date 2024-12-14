"use server";
import { auth } from "@clerk/nextjs/server";
import { authenticateAndRedirect } from "./job-actions";
import db from "@/lib/db";
import dayjs from "dayjs";
import { redirect } from "next/navigation";
export async function getStatsAction() {
  const userId = await authenticateAndRedirect();

  try {
    const stats = await db.job.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      where: {
        clerkId: userId,
      },
    });

    const statsOject = stats.reduce(
      (acc, curr) => {
        acc[curr.status] = curr._count.status;
        return acc;
      },
      {} as Record<string, number>,
    );

    const defaultStats = {
      pending: 0,
      declined: 0,
      interview: 0,
      ...statsOject,
    };
    return defaultStats;
  } catch (error) {
    return "/jobs";
  }
}

export async function getChartsDateAction() {
  const userId = await authenticateAndRedirect();

  const sixMonthsAgo = dayjs().subtract(6, "month").toDate();

  try {
    const jobs = await db.job.findMany({
      where: {
        clerkId: userId,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    let applicationsPerMonth = jobs.reduce(
      (acc, job) => {
        const date = dayjs(job.createdAt).format("MMM YY");

        const existingEntry = acc.find((entry) => entry.date === date);

        if (existingEntry) {
          existingEntry.count += 1;
        } else {
          acc.push({ date, count: 1 });
        }

        return acc;
      },
      [] as Array<{ date: string; count: number }>,
    );
    return applicationsPerMonth;
  } catch (error) {
    redirect("/jobs");
  }
}
