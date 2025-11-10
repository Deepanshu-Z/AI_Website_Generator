"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs"; // ✅ added useUser
import axios from "axios";
import {
  ArrowUp,
  HomeIcon,
  Key,
  LayoutDashboard,
  Loader2Icon,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { UserDetailsContext } from "../context/UserDetailsContext";

function generateRandomId() {
  return Math.floor(Math.random() * 1000000);
}

const suggestion = [
  {
    label: "Dashboard",
    prompt: "Create an analytics dashboard page with charts and graphs.",
    icon: LayoutDashboard,
  },
  {
    label: "Signup form",
    prompt:
      "Create a modern signup form page with name, email, and password fields.",
    icon: Key,
  },
  {
    label: "Hero",
    prompt:
      "Create a modern header and centered hero section for a productivity SaaS.",
    icon: HomeIcon,
  },
  {
    label: "User profile card",
    prompt: "Create a user profile card with avatar, bio, and social links.",
    icon: User,
  },
];

export const Hero = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUser();
  const { has } = useAuth();
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const hasUnlimitedAccess = has && has({ plan: "unlimited" });
  const router = useRouter();

  async function handleSubmit() {
    if (!hasUnlimitedAccess && userDetails.credits! <= 0) {
      toast.error("You have no credits left, Please upgrade your plan");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const projectId = uuidv4();
    const frameId = generateRandomId();
    const messages = [
      {
        role: "user",
        content: userInput,
      },
    ];

    try {
      const result = await axios.post("/api/projects", {
        projectId,
        frameId,
        messages,
        credits: userDetails?.credits,
      });

      toast.success("Project created successfully!");
      setUserDetails((prev: any) => ({
        ...prev,
        credits: prev?.credits! - 1,
      }));

      router.push(`/playground/${projectId}?frameId=${frameId}`);
    } catch (error) {
      toast.error("Failed to create project. Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center h-[80vh] justify-center">
      <h2 className="text-6xl font-bold">What should we design?</h2>
      <p className="mt-2 text-xl text-gray-600">
        Generate, Edit and Explore designs with AI — Export Code instantly
      </p>

      <div className="w-full max-w-xl p-5 border mt-5 rounded-2xl">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Describe your page design"
          className="w-full h-24 focus:outline-none focus:ring-0 resize-none"
        />

        <div className="flex justify-end">
          {isLoading ? (
            <Button disabled>
              <Loader2Icon className="animate-spin" />
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button
                disabled={!userInput}
                onClick={user ? handleSubmit : undefined}
              >
                <ArrowUp />
              </Button>
            </SignInButton>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-3 flex-wrap justify-center">
        {suggestion.map((item, index) => (
          <Button
            variant="outline"
            key={index}
            onClick={() => setUserInput(item.prompt)}
          >
            <item.icon className="mr-2" />
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
