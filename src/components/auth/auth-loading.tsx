import Logo from "@/components/common/Logo";
import { Spinner } from "@/components/ui/spinner";

export default function AuthLoading({
  label = "Authenticating session...",
}: {
  label?: string;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background/50 backdrop-blur-xs gap-4">
      <Logo size="md" withLink={false} />
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground mt-2">
        <Spinner className="size-4 text-primary" />
        <span>{label}</span>
      </div>
    </div>
  );
}
