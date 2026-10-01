"use client";

import { useQuery } from "@tanstack/react-query";
import { Award, CalendarCheck, Users, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getAttendanceReport,
  getEnrollmentReport,
  getFinanceReport,
  getResultReport,
} from "@/api/admin.api";
import StatCard from "@/components/common/stat-card";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
const ATTENDANCE_COLORS: Record<string, string> = {
  PRESENT: "#10b981",
  ABSENT: "#ef4444",
  LATE: "#f59e0b",
  EXCUSED: "#6b7280",
};

export default function AdminReportsPage() {
  const { data: enrollmentData, isLoading: loadingEnrollment } = useQuery({
    queryKey: ["reports", "enrollment"],
    queryFn: () => getEnrollmentReport(),
  });

  const { data: attendanceData, isLoading: loadingAttendance } = useQuery({
    queryKey: ["reports", "attendance"],
    queryFn: () => getAttendanceReport(),
  });

  const { data: resultData, isLoading: loadingResult } = useQuery({
    queryKey: ["reports", "result"],
    queryFn: () => getResultReport(),
  });

  const { data: financeData, isLoading: loadingFinance } = useQuery({
    queryKey: ["reports", "finance"],
    queryFn: () => getFinanceReport(),
  });

  const enrollment = enrollmentData?.data;
  const attendance = attendanceData?.data;
  const result = resultData?.data;
  const finance = financeData?.data;

  // Prepare Program chart data
  const programChartData =
    enrollment?.enrollmentsByProgram?.map((p: any) => ({
      name: p.programCode,
      students: p.studentCount,
    })) || [];

  // Prepare Attendance breakdown data
  const attendanceChartData = attendance?.breakdown
    ? Object.entries(attendance.breakdown).map(([status, count]) => ({
        name: status,
        count: Number(count),
      }))
    : [];

  // Prepare Grade distribution data
  const gradeChartData = result?.gradeDistribution
    ? Object.entries(result.gradeDistribution).map(([grade, count]) => ({
        grade,
        students: Number(count),
      }))
    : [];

  // Prepare Finance chart data
  const financeChartData = finance
    ? [
        {
          name: "Collected",
          amount: finance.totalCollectedAmount,
          fill: "#10b981",
        },
        {
          name: "Outstanding",
          amount: finance.totalUnpaidAmount,
          fill: "#ef4444",
        },
      ]
    : [];

  const isLoading =
    loadingEnrollment || loadingAttendance || loadingResult || loadingFinance;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Institutional Analytics & Visualizations
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Authoritative Recharts analytics driven by live backend enrollment,
          attendance, examination, and tuition records.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Enrollments"
          value={enrollment?.totalActiveEnrollments ?? "—"}
          subtitle="Enrolled students across sections"
          icon={Users}
          badgeClass="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
        />

        <StatCard
          title="Attendance Rate"
          value={attendance ? `${attendance.overallAttendanceRate}%` : "—"}
          subtitle="Average student participation"
          icon={CalendarCheck}
          badgeClass="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
        />

        <StatCard
          title="Academic Pass Rate"
          value={result ? `${result.passRate}%` : "—"}
          subtitle={`Avg GPA: ${result?.averageGradePoint || 0}`}
          icon={Award}
          badgeClass="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
        />

        <StatCard
          title="Tuition Collection"
          value={finance ? `${finance.collectionRate}%` : "—"}
          subtitle={`BDT ${finance?.totalCollectedAmount?.toLocaleString() || 0} collected`}
          icon={Wallet}
          badgeClass="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Enrollments by Degree Program */}
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Students by Degree Program
            </h2>
            <p className="text-xs text-muted-foreground">
              Active student distribution across university programs
            </p>
          </div>

          <div className="h-64 w-full">
            {isLoading ? (
              <Skeleton className="size-full rounded-xl" />
            ) : programChartData.length === 0 ? (
              <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                No active program enrollments recorded
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={programChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} />
                  <YAxis fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderRadius: "8px",
                      borderColor: "var(--color-border)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="students"
                    fill="oklch(0.38 0.16 260)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 2. Attendance Status Breakdown */}
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Attendance Status Distribution
            </h2>
            <p className="text-xs text-muted-foreground">
              Aggregated session records (Present, Absent, Late, Excused)
            </p>
          </div>

          <div className="h-64 w-full">
            {isLoading ? (
              <Skeleton className="size-full rounded-xl" />
            ) : attendanceChartData.every((d) => d.count === 0) ? (
              <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                No attendance sessions recorded yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    fontSize={11}
                  >
                    {attendanceChartData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={ATTENDANCE_COLORS[entry.name] || COLORS[0]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderRadius: "8px",
                      borderColor: "var(--color-border)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend fontSize={12} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 3. Published Grade Distribution */}
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Grade Distribution
            </h2>
            <p className="text-xs text-muted-foreground">
              Frequency of awarded letter grades across completed courses
            </p>
          </div>

          <div className="h-64 w-full">
            {isLoading ? (
              <Skeleton className="size-full rounded-xl" />
            ) : gradeChartData.length === 0 ? (
              <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                No course results published yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="grade" fontSize={12} tickLine={false} />
                  <YAxis fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderRadius: "8px",
                      borderColor: "var(--color-border)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="students"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 4. Tuition Collection vs Outstanding */}
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Financial Tuition Realization
            </h2>
            <p className="text-xs text-muted-foreground">
              Collected fees vs pending invoice receivables (BDT)
            </p>
          </div>

          <div className="h-64 w-full">
            {isLoading ? (
              <Skeleton className="size-full rounded-xl" />
            ) : financeChartData.every((d) => d.amount === 0) ? (
              <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                No invoices generated yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={financeChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    label={({ name, value }) =>
                      `${name}: BDT ${value.toLocaleString()}`
                    }
                    fontSize={11}
                  >
                    {financeChartData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) =>
                      `BDT ${Number(val).toLocaleString()}`
                    }
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderRadius: "8px",
                      borderColor: "var(--color-border)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend fontSize={12} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
