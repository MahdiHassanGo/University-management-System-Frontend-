import {
  BarChart3,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: Zap,
      title: "Real-Time Course Registration",
      desc: "Enroll into available sections with dynamic capacity validation, credit cap enforcement, and instant schedule conflict detection.",
    },
    {
      icon: ShieldCheck,
      title: "Strict Role-Based Security",
      desc: "Engineered with dual-layer route protection: Next.js middleware edge enforcement coupled with backend JWT and database verification.",
    },
    {
      icon: RefreshCw,
      title: "Optimistic State Updates",
      desc: "Instant UI responsiveness for daily tasks like marking notifications as read with automatic rollback on network failure.",
    },
    {
      icon: BarChart3,
      title: "Interactive Analytics Visualizations",
      desc: "Super Admin visual intelligence powered by Recharts covering semester enrollment trends, attendance rates, and grade distribution.",
    },
    {
      icon: Wallet,
      title: "SSLCommerz Payment Gateway",
      desc: "Seamless test payment integration for semester tuition invoices with cryptographic transaction verification.",
    },
    {
      icon: CheckCircle2,
      title: "Automated CGPA & Transcripts",
      desc: "Authoritative cumulative GPA computation and instant unofficial transcript generation for graduating scholars.",
    },
  ];

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Comprehensive Campus Capabilities
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Engineered to satisfy the rigorous functional demands of university
          administration and digital campus life.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.title}
              className="rounded-2xl border p-6 bg-card shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Icon className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">
                {feat.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
