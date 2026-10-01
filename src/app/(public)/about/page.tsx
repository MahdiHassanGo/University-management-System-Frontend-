import { Award, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          About UniCore Academic System
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          UniCore ERP is an enterprise campus information architecture designed
          to modernize academic administration, foster student agency, and
          enforce institutional integrity.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="rounded-2xl border p-8 bg-card shadow-sm space-y-3">
          <Shield className="size-8 text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Mission & Academic Integrity
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our mission is to eliminate bureaucratic friction from academic
            journeys. By enforcing strict prerequisite checking, automated grade
            point averaging, and role-based data security, UniCore ensures every
            academic milestone is validated and trustworthy.
          </p>
        </div>

        <div className="rounded-2xl border p-8 bg-card shadow-sm space-y-3">
          <Award className="size-8 text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Accreditation Standards
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Fully compatible with standard semester credit systems (e.g.
            140-credit B.Sc. curricula, 21-credit semester limits), standard
            grading scales (4.00 CGPA grading matrix), and real-time attendance
            thresholds.
          </p>
        </div>
      </div>
    </div>
  );
}
