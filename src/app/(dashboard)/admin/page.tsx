import { Suspense } from "react";
import PageSkeleton from "@/components/common/page-skeleton";
import View from "@/components/modules/workspaces/admin/view";
export const metadata = { title: "Admin | UniCore" };
export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <View />
    </Suspense>
  );
}
