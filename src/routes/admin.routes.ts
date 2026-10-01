import {
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Receipt,
  ShieldAlert,
  UserCheck,
  Users,
} from "lucide-react";
import type { SidebarItems } from "@/types";

export const adminRoutes: SidebarItems = [
  {
    title: "Governance",
    items: [
      {
        title: "Overview",
        url: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics & Reports",
        url: "/admin/reports",
        icon: BarChart3,
      },
      {
        title: "Audit Logs",
        url: "/admin/audit-logs",
        icon: ShieldAlert,
      },
    ],
  },
  {
    title: "Academic Catalog",
    items: [
      {
        title: "Departments",
        url: "/admin/departments",
        icon: Building2,
      },
      {
        title: "Programs",
        url: "/admin/programs",
        icon: GraduationCap,
      },
      {
        title: "Courses",
        url: "/admin/courses",
        icon: BookOpen,
      },
      {
        title: "Semesters",
        url: "/admin/semesters",
        icon: CalendarDays,
      },
      {
        title: "Sections",
        url: "/admin/sections",
        icon: Layers,
      },
    ],
  },
  {
    title: "People & Records",
    items: [
      {
        title: "Students",
        url: "/admin/students",
        icon: Users,
      },
      {
        title: "Instructors",
        url: "/admin/instructors",
        icon: UserCheck,
      },
      {
        title: "Enrollments",
        url: "/admin/enrollments",
        icon: ClipboardList,
      },
      {
        title: "Fee Invoices",
        url: "/admin/invoices",
        icon: Receipt,
      },
    ],
  },
];
