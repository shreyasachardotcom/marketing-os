import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-light-gray">
      <div className="text-center">
        <h1 className="text-h1 mb-4">Marketing OS</h1>
        <p className="text-body mb-8 text-dark-gray">
          Minimal, transparent project management for Plum's marketing team
        </p>
        <Link href="/auth/signin">
          <Button size="lg">Get Started</Button>
        </Link>
      </div>
    </div>
  );
}
