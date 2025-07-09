import {
  AdminDataTable,
  AdminSectionCards,
  AdminTaskCharts,
} from "@/components/admin";

import { AdminLayout } from "@/components/layouts/AdminLayout";

export default function Page() {
  return (
    <AdminLayout>
      <AdminSectionCards />
      <div className="px-4 lg:px-6">
        <AdminTaskCharts />
      </div>
      <div className="px-4 lg:px-6">
        <AdminDataTable />
      </div>
    </AdminLayout>
  );
}
