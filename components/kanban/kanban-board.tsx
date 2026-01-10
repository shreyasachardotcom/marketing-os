"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskStage } from "@prisma/client";

type Task = {
  id: string;
  title: string;
  stage: TaskStage;
  dueDate: Date | null;
  assignee: { name: string | null } | null;
  project: { title: string };
};

type KanbanBoardProps = {
  initialTasks: Task[];
  onTaskMove: (taskId: string, newStage: TaskStage) => Promise<void>;
};

const columns = [
  { id: "BACKLOG", title: "Backlog" },
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "CREATOR_REVIEW", title: "Creator Review" },
  { id: "REVIEWER_REVIEW", title: "Reviewer Review" },
  { id: "DONE", title: "Done" },
] as const;

function getTaskLabel(task: Task) {
  if (!task.dueDate || task.stage === "DONE") return null;
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  return dueDate >= today ? "ON_TRACK" : "DELAYED";
}

export function KanbanBoard({ initialTasks, onTaskMove }: KanbanBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStage = destination.droppableId as TaskStage;

    // Optimistically update UI
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === draggableId ? { ...task, stage: newStage } : task
      )
    );

    // Update on server
    try {
      await onTaskMove(draggableId, newStage);
    } catch (error) {
      // Revert on error
      setTasks(initialTasks);
      console.error("Failed to update task:", error);
    }
  };

  const getTasksByStage = (stage: TaskStage) => {
    return tasks.filter((task) => task.stage === stage);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnTasks = getTasksByStage(column.id);

          return (
            <div key={column.id} className="min-w-[280px] flex-shrink-0">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">{column.title}</h3>
                <span className="text-sm text-medium-gray">
                  {columnTasks.length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] rounded-lg bg-light-gray p-2 ${
                      snapshot.isDraggingOver ? "bg-medium-gray/20" : ""
                    }`}
                  >
                    {columnTasks.map((task, index) => {
                      const label = getTaskLabel(task);

                      return (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2"
                            >
                              <Card
                                className={`cursor-grab active:cursor-grabbing ${
                                  snapshot.isDragging ? "shadow-lg" : ""
                                }`}
                              >
                                <CardContent className="p-3">
                                  <h4 className="mb-2 text-sm font-medium">
                                    {task.title}
                                  </h4>
                                  <p className="mb-2 text-xs text-dark-gray">
                                    {task.project.title}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    {task.assignee && (
                                      <span className="text-xs text-medium-gray">
                                        {task.assignee.name}
                                      </span>
                                    )}
                                    {label && (
                                      <Badge
                                        variant={
                                          label === "ON_TRACK"
                                            ? "success"
                                            : "destructive"
                                        }
                                        className="text-xs"
                                      >
                                        {label === "ON_TRACK"
                                          ? "On Track"
                                          : "Delayed"}
                                      </Badge>
                                    )}
                                  </div>
                                  {task.dueDate && (
                                    <p className="mt-2 text-xs text-medium-gray">
                                      Due:{" "}
                                      {new Date(task.dueDate).toLocaleDateString()}
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
