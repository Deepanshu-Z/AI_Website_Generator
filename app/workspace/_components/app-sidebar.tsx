"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserDetailsContext } from "@/app/context/UserDetailsContext";
import { Progress } from "@/components/ui/progress";
import { useAuth, UserButton } from "@clerk/nextjs";
import axios from "axios";

export default function AppSidebar() {
  const [projectList, setProjectList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userDetails } = useContext(UserDetailsContext);
  const { has } = useAuth();
  const hasUnlimitedAccess = has && has({ plan: "unlimited" });
  useEffect(() => {
    const getAllProjects = async () => {
      try {
        const { data } = await axios.get("/api/getAllProjects");
        setProjectList(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    getAllProjects();
  }, []);

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={"/"}>
          <div className="flex items-center justify-between gap-2">
            <img src="/logo.svg" height={35} width={35} alt="Logo" />
            <h2 className="font-bold">AI Website Generator</h2>
          </div>
        </Link>
        <Link href="/workspace">
          <Button className="w-full">+ Add new project</Button>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>

          {loading ? (
            <p className="p-4 text-sm text-muted-foreground italic">
              Loading projects...
            </p>
          ) : projectList.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No projects found. Create a new one to get started.
            </div>
          ) : (
            <div className="p-2 flex flex-col gap-2">
              {projectList.map((project: any, i) => (
                <div
                  key={i}
                  className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <Link
                    key={i}
                    href={`/playground/${project.projectId}?frameId=${project.frameId}`}
                  >
                    <p className="truncate text-sm font-medium">
                      {project?.chats?.[0]?.chatMessage?.[0]?.content ||
                        "Untitled Project"}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {!hasUnlimitedAccess && (
          <div className="flex flex-col gap-5">
            <h2>
              Remaining Credits:
              <span className="font-bold ml-1">{userDetails.credits}</span>
            </h2>
            <Progress value={(userDetails?.credits / 2) * 100} />
            <Link href={"/workspace/pricing"}>
              <Button>Upgrade to Unlimited</Button>
            </Link>
          </div>
        )}

        <div className="flex items-center gap-2">
          <UserButton />
          <Button variant="ghost">Settings</Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
