"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

import { useContext, useEffect, useState } from "react";
import { UserDetailsContext } from "./context/UserDetailsContext";
import { OnSaveContext } from "./context/OnSaveContext";

export const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState<any>(UserDetailsContext);
  const [onSaveData, setOnSaveData] = useState<any>();
  useEffect(() => {
    user && createNewUser();
  }, [user]);

  const createNewUser = async () => {
    const result = await axios.post("/api/users");
    setUserDetails(result.data?.user);
  };

  return (
    <div>
      <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
        <OnSaveContext.Provider value={[onSaveData, setOnSaveData]}>
          {children}
        </OnSaveContext.Provider>
      </UserDetailsContext.Provider>
    </div>
  );
};
