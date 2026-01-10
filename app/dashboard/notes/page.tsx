import { getServerSession } from "next/auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, File, FileText } from "lucide-react";

async function getNoteFiles() {
  return await prisma.noteFile.findMany({
    include: {
      pages: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export default async function NotesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const files = await getNoteFiles();

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-h1">Team Notes</h1>
          <p className="mt-2 text-dark-gray">
            Collaborative knowledge base for the team
          </p>
        </div>
        <Link href="/dashboard/notes/new-file">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New File
          </Button>
        </Link>
      </div>

      {files.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <File className="h-12 w-12 text-medium-gray" />
            <p className="mt-4 text-medium-gray">
              No files yet. Create your first file to get started.
            </p>
            <Link href="/dashboard/notes/new-file">
              <Button className="mt-4">Create File</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <Card key={file.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <File className="h-5 w-5" />
                  {file.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {file.pages.length === 0 ? (
                    <p className="text-sm text-medium-gray">No pages yet</p>
                  ) : (
                    file.pages.slice(0, 5).map((page) => (
                      <Link
                        key={page.id}
                        href={`/dashboard/notes/page/${page.id}`}
                        className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-light-gray"
                      >
                        <FileText className="h-4 w-4 text-medium-gray" />
                        <span className="truncate">{page.title}</span>
                      </Link>
                    ))
                  )}
                  {file.pages.length > 5 && (
                    <p className="text-xs text-medium-gray">
                      +{file.pages.length - 5} more pages
                    </p>
                  )}
                </div>
                <Link href={`/dashboard/notes/file/${file.id}`}>
                  <Button variant="outline" className="mt-4 w-full">
                    View All Pages
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
