import { ReactNode } from "react";
import Navbar from "@/components/dashboard/navbar";
import Sidbar from "@/components/dashboard/sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main className="grid lg:grid-cols-5">
      <div className="hidden lg:block lg:col-span-1 lg:min-h-screen">
        <Sidbar />
      </div>
      <div className="lg:col-span-4">
        <Navbar />
        <div className="py-16 px-4 sm:px-8 lg:px-16">{children}</div>
      </div>
    </main>
  );
}
