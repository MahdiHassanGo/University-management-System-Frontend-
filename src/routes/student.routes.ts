import {
  BookMarked,
  CalendarCheck2,
  CreditCard,
  FileCheck2,
  Layers,
  LayoutDashboard,
  Scroll,
  User,
} from "lucide-react";
import type { SidebarItems } from "@/types";

export const studentRoutes: SidebarItems = [
  {
    title: "Student Portal",
    items: [
      {
        title: "Overview",
        url: "/student",
        icon: LayoutDashboard,
      },
      {
        title: "Course Registration",
        url: "/student/registration",
        icon: BookMarked,
      },
      {
        title: "My Classes",
        url: "/student/courses",
        icon: Layers,
      },
    ],
  },
  {
    title: "Academic Records",
    items: [
      {
        title: "My Attendance",
        url: "/student/attendance",
        icon: CalendarCheck2,
      },
      {
        title: "Grades & Results",
        url: "/student/results",
        icon: FileCheck2,
      },
      {
        title: "Official Transcript",
        url: "/student/transcript",
        icon: Scroll,
      },
    ],
  },
  {
    title: "Finance & Profile",
    items: [
      {
        title: "Tuition & Invoices",
        url: "/student/finance",
        icon: CreditCard,
      },
      {
        title: "Student Profile",
        url: "/student/profile",
        icon: User,
      },
    ],
  },
];
