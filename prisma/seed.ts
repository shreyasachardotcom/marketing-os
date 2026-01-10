import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with placeholder data...");

  // Get the first user (you)
  const user = await prisma.user.findFirst();

  if (!user) {
    console.log("❌ No user found. Please sign in first!");
    return;
  }

  console.log(`✅ Found user: ${user.email}`);

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      title: "Q1 2026 Marketing Campaign",
      description: "Launch campaign for new product line",
      createdById: user.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: "Brand Refresh Initiative",
      description: "Update brand guidelines and visual identity",
      createdById: user.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: "Content Marketing Strategy",
      description: "Develop content calendar and SEO strategy",
      createdById: user.id,
    },
  });

  console.log("✅ Created 3 projects");

  // Create sample tasks
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  await prisma.task.createMany({
    data: [
      // Backlog tasks
      {
        title: "Design social media graphics",
        description: "Create Instagram and LinkedIn post templates",
        projectId: project1.id,
        createdById: user.id,
        assigneeId: user.id,
        stage: "BACKLOG",
        startDate: nextWeek,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Write email campaign copy",
        description: "Draft 5 promotional emails for product launch",
        projectId: project1.id,
        createdById: user.id,
        assigneeId: user.id,
        stage: "BACKLOG",
        startDate: nextWeek,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      // To Do tasks
      {
        title: "Update brand style guide",
        description: "Refresh color palette and typography guidelines",
        projectId: project2.id,
        createdById: user.id,
        assigneeId: user.id,
        stage: "TODO",
        startDate: lastWeek,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        label: "ON_TRACK",
      },
      {
        title: "Conduct competitor analysis",
        description: "Research top 5 competitors' marketing strategies",
        projectId: project3.id,
        createdById: user.id,
        assigneeId: user.id,
        stage: "TODO",
        startDate: lastWeek,
        dueDate: tomorrow,
        label: "ON_TRACK",
      },
      // In Progress tasks
      {
        title: "Create Q1 content calendar",
        description: "Plan blog posts, social media, and email content",
        projectId: project3.id,
        createdById: user.id,
        assigneeId: user.id,
        stage: "IN_PROGRESS",
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        label: "ON_TRACK",
      },
      // Delayed task
      {
        title: "Set up marketing analytics dashboard",
        description: "Configure Google Analytics and tracking pixels",
        projectId: project1.id,
        createdById: user.id,
        assigneeId: user.id,
        stage: "IN_PROGRESS",
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        dueDate: lastWeek,
        label: "DELAYED",
      },
    ],
  });

  console.log("✅ Created 6 sample tasks");

  // Create sample requisitions
  await prisma.requisition.createMany({
    data: [
      {
        requestorName: "Sarah Johnson",
        requestorEmail: "sarah@plum.com",
        department: "Customer Success",
        requirementName: "Customer onboarding video",
        etd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        brief: "Need a 2-minute explainer video for new customers showing how to use our platform",
        references: "https://example.com/competitor-video",
        priority: "P1",
        stage: "NEW",
        createdById: user.id,
      },
      {
        requestorName: "Michael Chen",
        requestorEmail: "michael@plum.com",
        department: "Sales",
        requirementName: "Sales presentation template",
        etd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        brief: "Updated PowerPoint template with new branding for client pitches",
        priority: "P2",
        stage: "ASSIGNED",
        createdById: user.id,
        assigneeId: user.id,
      },
      {
        requestorName: "Emma Davis",
        requestorEmail: "emma@plum.com",
        department: "HR",
        requirementName: "Recruitment marketing materials",
        etd: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        brief: "Create 'Join Our Team' brochure and social media graphics",
        references: "Attached: company_culture.pdf",
        priority: "P3",
        stage: "NEW",
        createdById: user.id,
      },
    ],
  });

  console.log("✅ Created 3 sample requisitions");

  // Create sample notes
  const noteFile1 = await prisma.noteFile.create({
    data: {
      title: "Marketing Team Sync",
      pages: {
        create: [
          {
            title: "Week of January 13, 2026",
            content: JSON.stringify({
              type: "doc",
              content: [
                {
                  type: "heading",
                  attrs: { level: 2 },
                  content: [{ type: "text", text: "Team Updates" }],
                },
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Q1 campaign is on track. Social media engagement up 25%.",
                    },
                  ],
                },
              ],
            }),
          },
          {
            title: "Week of January 6, 2026",
            content: JSON.stringify({
              type: "doc",
              content: [
                {
                  type: "heading",
                  attrs: { level: 2 },
                  content: [{ type: "text", text: "Action Items" }],
                },
                {
                  type: "bulletList",
                  content: [
                    {
                      type: "listItem",
                      content: [
                        {
                          type: "paragraph",
                          content: [
                            {
                              type: "text",
                              text: "Review brand guidelines - Due Friday",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            }),
          },
        ],
      },
    },
  });

  const noteFile2 = await prisma.noteFile.create({
    data: {
      title: "Brand Guidelines",
      pages: {
        create: [
          {
            title: "Color Palette",
            content: JSON.stringify({
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Primary: #3B82F6, Secondary: #10B981",
                    },
                  ],
                },
              ],
            }),
          },
        ],
      },
    },
  });

  console.log("✅ Created 2 note files with pages");

  console.log("\n🎉 Seeding complete!");
  console.log("\nCreated:");
  console.log("  • 3 Projects");
  console.log("  • 6 Tasks (Backlog, To Do, In Progress)");
  console.log("  • 3 Requisitions");
  console.log("  • 2 Note Files with Pages");
  console.log("\n✅ Your dashboard is now populated with sample data!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
