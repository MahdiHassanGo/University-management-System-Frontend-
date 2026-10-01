"use client";

import { GoogleLogin as ReactGoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getMe } from "@/api";
import { toast } from "@/components/ui/toast";
import { useGoogleOAuth } from "@/hooks";

export default function GoogleLoginComponent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: loginWithGoogle } = useGoogleOAuth();

  return (
    <div className="flex justify-center w-full">
      <ReactGoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) {
            toast.add({
              title: "Google Authentication Failed",
              description: "No Google credential token received",
              type: "error",
            });
            return;
          }

          loginWithGoogle(
            { idToken: credentialResponse.credential },
            {
              onSuccess: async () => {
                const meRes = await queryClient.fetchQuery({
                  queryKey: ["user"],
                  queryFn: getMe,
                });

                const user = meRes?.data?.user || meRes?.data;
                const role = user?.role || "STUDENT";

                toast.add({
                  title: "Google Sign-in Successful",
                  description: "Welcome to University Portal",
                  type: "success",
                });

                const target =
                  role === "SUPER_ADMIN"
                    ? "/admin"
                    : role === "INSTRUCTOR"
                      ? "/instructor"
                      : "/student";

                router.push(target);
              },
              onError: (err: any) => {
                toast.add({
                  title: "Authentication Error",
                  description:
                    err?.data?.message ||
                    err?.message ||
                    "Google sign-in failed",
                  type: "error",
                });
              },
            },
          );
        }}
        onError={() => {
          toast.add({
            title: "Google Login Failed",
            description: "Could not initialize Google authentication popup",
            type: "error",
          });
        }}
        theme="outline"
        size="large"
        shape="rectangular"
        text="continue_with"
        width="100%"
      />
    </div>
  );
}
