import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { TaskCharts } from "@/components/task-charts";
import { UserLayout } from "@/components/layouts/UserLayout";
import data from "./data.json";

export default function Page() {
  return (
    <UserLayout>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <TaskCharts />
      </div>
      <DataTable data={data} />
    </UserLayout>
  );
}
