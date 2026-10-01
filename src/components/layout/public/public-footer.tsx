import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/common/Logo";

export default function PublicFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering institutional excellence through real-time academic
              scheduling, student governance, and secure billing.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
              Academics
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/academics"
                  className="hover:text-primary transition-colors"
                >
                  Undergraduate Degrees
                </Link>
              </li>
              <li>
                <Link
                  href="/academics"
                  className="hover:text-primary transition-colors"
                >
                  Academic Calendar
                </Link>
              </li>
              <li>
                <Link
                  href="/academics"
                  className="hover:text-primary transition-colors"
                >
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/academics"
                  className="hover:text-primary transition-colors"
                >
                  Graduation Criteria
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
              Portal Access
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors"
                >
                  Student Portal Login
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors"
                >
                  Faculty Workspace
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors"
                >
                  Super Admin Console
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-primary transition-colors"
                >
                  New Student Registration
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
              Campus Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-primary" />
                <span>124 University Avenue, Academic Square</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" />
                <span>+880 (2) 887-2100</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" />
                <span>registrar@university.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>
            © {new Date().getFullYear()} UniCore ERP. All academic rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              Terms of Enrollment
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary transition-colors"
            >
              Campus Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
