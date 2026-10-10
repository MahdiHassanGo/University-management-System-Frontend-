import { Suspense } from "react";
import PageSkeleton from "@/components/common/page-skeleton";
import View from "@/components/modules/workspaces/instructor/profile/view";
export const metadata = { title: "Instructor Profile | UniCore" };
export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <View />
    </Suspense>
  );
}
