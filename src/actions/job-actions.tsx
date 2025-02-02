"use server";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  JobType,
  CreateAndEditJobType,
  createAndEditJobSchema,
  JobStatus,
} from "@/lib/types";
import { redirect } from "next/navigation";
import { Job, Prisma } from "@prisma/client";
import dayjs from "dayjs";

export async function authenticateAndRedirect() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }
  return userId;
}

export async function createJobAction(values: CreateAndEditJobType) {
  const userId = await authenticateAndRedirect();
  try {
    createAndEditJobSchema.parse(values);
    const job: JobType = await db.job.create({
      data: {
        ...values,
        clerkId: userId,
      },
    });
    return job;
  } catch (error) {
    console.error(error);
    return null;
  }
}

type GetAllJobsActionTypes = {
  search?: string;
  jobStatus?: string;
  page?: number;
  limit?: number;
};

export async function getAllJobsAction({
  search,
  jobStatus,
  page = 1,
  limit = 10,
}: GetAllJobsActionTypes) {
  const userId = await authenticateAndRedirect();

  try {
    let whereClause: Prisma.JobWhereInput = {
      clerkId: userId,
    };

    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          {
            position: {
              contains: search,
            },
          },
          {
            company: {
              contains: search,
            },
          },
        ],
      };
    }
    if (jobStatus && jobStatus !== "all") {
      whereClause = {
        ...whereClause,
        status: jobStatus,
      };
    }

    const jobs: JobType[] = await db.job.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });
    return { jobs, count: 0, page: 1, totalPages: 0 };
  } catch (error) {
    console.error(error);
    return { jobs: [], count: 0, page: 1, totalPages: 0 };
  }
}

export async function deleteJobAction(id: string): Promise<JobType | null> {
  const userId = await authenticateAndRedirect();

  try {
    const job = await db.job.delete({
      where: {
        id,
        clerkId: userId,
      },
    });
    return job;
  } catch (error) {
    return null;
  }
}

export async function getSingleJobAction(id: string) {
  let job: JobType | null = null;
  const userId = await authenticateAndRedirect();

  try {
    job = await db.job.findUnique({
      where: {
        id,
        clerkId: userId,
      },
    });
  } catch (error) {
    job = null;
  }

  if (!job) {
    redirect("/jobs");
  }
  return job;
}

export async function updateJobAction(
  id: string,
  values: CreateAndEditJobType,
) {
  const userId = await authenticateAndRedirect();

  try {
    const job: JobType = await db.job.update({
      where: {
        id,
        clerkId: userId,
      },
      data: {
        ...values,
      },
    });
    return job;
  } catch (error) {
    return null;
  }
}
