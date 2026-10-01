import {
  Award,
  CalendarCheck,
  FileSpreadsheet,
  Layers,
  LayoutDashboard,
  User,
} from "lucide-react";
import type { SidebarItems } from "@/types";

export const instructorRoutes: SidebarItems = [
  {
    title: "Faculty Dashboard",
    items: [
      {
        title: "Overview",
        url: "/instructor",
        icon: LayoutDashboard,
      },
      {
        title: "Assigned Sections",
        url: "/instructor/sections",
        icon: Layers,
      },
    ],
  },
  {
    title: "Academic Workflows",
    items: [
      {
        title: "Attendance",
        url: "/instructor/attendance",
        icon: CalendarCheck,
      },
      {
        title: "Exams & Marks",
        url: "/instructor/exams",
        icon: FileSpreadsheet,
      },
      {
        title: "Grade Publication",
        url: "/instructor/results",
        icon: Award,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Faculty Profile",
        url: "/instructor/profile",
        icon: User,
      },
    ],
  },
];
