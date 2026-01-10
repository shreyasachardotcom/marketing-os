"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createNoteFile(data: { title: string }) {
  try {
    const file = await prisma.noteFile.create({
      data,
    });

    revalidatePath("/dashboard/notes");
    return { success: true, file };
  } catch (error) {
    console.error("Error creating note file:", error);
    return { success: false, error: "Failed to create note file" };
  }
}

export async function createNotePage(data: {
  title: string;
  content: string;
  fileId: string;
}) {
  try {
    const page = await prisma.notePage.create({
      data,
    });

    revalidatePath("/dashboard/notes");
    return { success: true, page };
  } catch (error) {
    console.error("Error creating note page:", error);
    return { success: false, error: "Failed to create note page" };
  }
}

export async function updateNotePage(data: {
  pageId: string;
  content: string;
  userId: string;
}) {
  try {
    // Update the page
    const page = await prisma.notePage.update({
      where: { id: data.pageId },
      data: { content: data.content },
    });

    // Create edit history entry
    await prisma.noteEdit.create({
      data: {
        pageId: data.pageId,
        userId: data.userId,
        content: data.content,
      },
    });

    revalidatePath(`/dashboard/notes/page/${data.pageId}`);
    return { success: true, page };
  } catch (error) {
    console.error("Error updating note page:", error);
    return { success: false, error: "Failed to update note page" };
  }
}

export async function deleteNoteFile(fileId: string) {
  try {
    await prisma.noteFile.delete({
      where: { id: fileId },
    });

    revalidatePath("/dashboard/notes");
    return { success: true };
  } catch (error) {
    console.error("Error deleting note file:", error);
    return { success: false, error: "Failed to delete note file" };
  }
}

export async function deleteNotePage(pageId: string) {
  try {
    await prisma.notePage.delete({
      where: { id: pageId },
    });

    revalidatePath("/dashboard/notes");
    return { success: true };
  } catch (error) {
    console.error("Error deleting note page:", error);
    return { success: false, error: "Failed to delete note page" };
  }
}
