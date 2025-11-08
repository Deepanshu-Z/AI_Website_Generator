import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight } from "lucide-react";
import path from "path";
import React from "react";

const menuItems = [
  {
    name: "Home",
    path: "/home",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

export const Header = () => {
  const user = currentUser();
  return (
    <div className="flex items-center justify-between w-full p-4 shadow">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="logo" height={35} width={35} />
        <h2 className="font-bold">AI WEBSITE GENERATOR</h2>
      </div>

      <div className="flex items-center gap-2">
        {menuItems.map((item, index) => (
          <Button variant="ghost" key={index}>
            {item.name}
          </Button>
        ))}
        {user != null ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
            <Button>
              Get Started <ArrowRight />
            </Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
};
