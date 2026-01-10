"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-light-gray">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-h2">Marketing OS</CardTitle>
          <CardDescription>
            Sign in with your Google account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full"
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
