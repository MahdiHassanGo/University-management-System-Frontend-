import { Suspense } from "react";
import PageSkeleton from "@/components/common/page-skeleton";
import View from "@/components/modules/workspaces/admin/programs/view";
export const metadata = { title: "Admin Programs | UniCore" };
export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <View />
    </Suspense>
  );
}
