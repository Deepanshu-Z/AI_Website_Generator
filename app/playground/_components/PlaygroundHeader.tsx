import { OnSaveContext } from "@/app/context/OnSaveContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useContext } from "react";

export const PlaygroundHeader = () => {
  const [onSaveData, setOnSaveData] = useContext(OnSaveContext);
  return (
    <div>
      <div className="flex justify-between shadow p-4">
        <Link href={"/"}>
          <img className="cursor-pointer" src="/logo.svg" alt="logo" />
        </Link>
        <Button onClick={() => setOnSaveData(Date.now)}>Save</Button>
      </div>
    </div>
  );
};
