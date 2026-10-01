import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Contact Academic Affairs & Support
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Get in touch with the Registrar, IT Campus Helpdesk, or Faculty
          Department Offices.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="rounded-2xl border p-6 bg-card shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-foreground">
              Campus Information
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground">
                    Main Campus
                  </div>
                  <div>124 University Avenue, Academic Square, Dhaka 1205</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground">
                    Registrar Hotline
                  </div>
                  <div>+880 (2) 887-2100 / Ext 401</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground">
                    Admissions & Registrar Email
                  </div>
                  <div>admissions@university.edu</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground">
                    Office Hours
                  </div>
                  <div>Sunday – Thursday: 9:00 AM – 5:00 PM (GMT+6)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-6 sm:p-8 bg-card shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Send an Inquiry
          </h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-foreground mb-1"
              >
                Your Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:border-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-foreground mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="scholar@example.edu"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:border-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-xs font-medium text-foreground mb-1"
              >
                Message / Question
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Inquire about course enrollment, credit transfers, or portal credentials..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:border-primary focus:outline-hidden"
              />
            </div>
            <Button type="button" className="w-full">
              Submit Campus Inquiry
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
