"use client";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { JobStatus } from "@/lib/types";
export default function JobSearch() {
  return (
    <>
      <h1>Search Bar</h1>
    </>
  );
}
