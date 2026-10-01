import { GraduationCap } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  withLink?: boolean;
}

export default function Logo({
  className = "",
  size = "md",
  withLink = true,
}: LogoProps) {
  const iconSizes = {
    sm: "size-7 p-1.5",
    md: "size-9 p-2",
    lg: "size-12 p-2.5",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  const content = (
    <div
      className={`flex items-center gap-2.5 font-bold tracking-tight ${className}`}
    >
      <div
        className={`flex items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20 ${iconSizes[size]}`}
      >
        <GraduationCap className="size-full" />
      </div>
      <div className="flex flex-col">
        <span
          className={`leading-none font-extrabold text-foreground ${textSizes[size]}`}
        >
          UniCore<span className="text-primary font-normal">ERP</span>
        </span>
        <span className="text-[10px] tracking-wider text-muted-foreground uppercase font-medium">
          University System
        </span>
      </div>
    </div>
  );

  if (withLink) {
    return (
      <Link
        href="/"
        className="inline-block transition-opacity hover:opacity-90"
      >
        {content}
      </Link>
    );
  }

  return content;
}
