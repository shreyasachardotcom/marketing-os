import { getServerSession } from "next/auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Plus, FileText } from "lucide-react";

async function getNoteFile(fileId: string) {
  return await prisma.noteFile.findUnique({
    where: { id: fileId },
    include: {
      pages: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export default async function FileDetailPage({
  params,
}: {
  params: { fileId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const file = await getNoteFile(params.fileId);

  if (!file) {
    redirect("/dashboard/notes");
  }

  return (
    <div className="p-8">
      <Link
        href="/dashboard/notes"
        className="mb-6 inline-flex items-center text-sm text-dark-gray hover:text-black"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Notes
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-h1">{file.title}</h1>
          <p className="mt-2 text-dark-gray">
            {file.pages.length} {file.pages.length === 1 ? "page" : "pages"}
          </p>
        </div>
        <Link href={`/dashboard/notes/file/${file.id}/new-page`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Page
          </Button>
        </Link>
      </div>

      {file.pages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-medium-gray" />
            <p className="mt-4 text-medium-gray">
              No pages yet. Create your first page to get started.
            </p>
            <Link href={`/dashboard/notes/file/${file.id}/new-page`}>
              <Button className="mt-4">Create Page</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {file.pages.map((page) => (
            <Link key={page.id} href={`/dashboard/notes/page/${page.id}`}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-medium-gray" />
                    <div className="flex-1">
                      <h3 className="font-medium">{page.title}</h3>
                      <p className="text-xs text-medium-gray">
                        Last updated:{" "}
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
