"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, useAuth } from "@clerk/nextjs";
import axios from "axios";
import {
  ArrowUp,
  HomeIcon,
  ImagePlus,
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
import { currentUser } from "@clerk/nextjs/server";

const suggestion = [
  {
    label: "Dasboard",
    prompt: "Create a analytics dashboard page with charts and graphs.",
    icon: LayoutDashboard,
  },
  {
    label: "Signp form",
    prompt:
      "Create a modern signup form page with name,email and password fields.",
    icon: Key,
  },
  {
    label: "Hero",
    prompt:
      "Create a modern header and centered hero section for a productivity SaaS. ",
    icon: HomeIcon,
  },
  {
    label: "User profile card",
    prompt: "Create a user profile card with avatar, bio and social links.",
    icon: User,
  },
];
function generateRandomId() {
  return Math.floor(Math.random() * 1000000);
}
export const Hero = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { has } = useAuth();
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const hasUnlimitedAccess = has && has({ plan: "unlimited" });
  const router = useRouter();
  const user = currentUser();

  async function handleSubmit() {
    if (!hasUnlimitedAccess && userDetails.credit! <= 0) {
      toast.error("You have no credits left, Please upgrade your plan");
      setIsLoading(false);
      return;
    }
    console.log(
      "HI i am printing something",
      "hasUnlimitedAccess?:",
      hasUnlimitedAccess,
      "credits:",
      userDetails.credit
    );
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
      console.log("Credits are: ", userDetails.credits);
      toast.success("Project created successfully!");
      setUserDetails((prev: any) => ({
        ...prev,
        credits: prev?.credits! - 1,
      }));
      setIsLoading(false);
      router.push(`/playground/${projectId}?frameId=${frameId}`);
    } catch (error) {
      toast.error("Failed to create project. Please try again.");
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col items-center h-[80vh] justify-center">
      {/*/////////////// description ///////////////*/}
      <h2 className="text-6xl font-bold">What should we design?</h2>
      <p className="mt-2 text-xl text-gray-600">
        Generate, Edit and Explore design with AI, Export Code as well
      </p>

      {/*/////////////// INPUT AREA AND BUTTON ///////////////*/}
      <div className="w-full max-w-xl p-5 border mt-5 rounded-2xl">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Describe your page design"
          className="w-full h-24 focus: outline-none focus:ring-0 resize-none"
        />

        {/*/////////////// buttons ///////////////*/}
        <div>
          {/* <SignInButton mode="modal" forceRedirectUrl={"/workspace"}> */}
          <div className="flex justify-end ">
            {/* <Button variant={"ghost"}>
              <ImagePlus />
            </Button> */}
            {isLoading ? (
              <Button disabled>
                <Loader2Icon className="animate-spin" />
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button
                  disabled={!userInput}
                  //@ts-ignore
                  onClick={user ? handleSubmit : undefined}
                >
                  <ArrowUp />
                </Button>
              </SignInButton>
            )}
          </div>
          {/* </SignInButton> */}
        </div>
      </div>

      {/*/////////////// suggestions ///////////////*/}
      <div className="mt-4 flex gap-3">
        {suggestion.map((item, index) => (
          <Button
            variant="outline"
            key={index}
            className="m-2"
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
