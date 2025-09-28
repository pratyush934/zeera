"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { BarLoader } from "react-spinners";


const UserLoading = () => {
  const { isLoaded } = useOrganization();
  const { isLoaded: userLoaded } = useUser();

  if (isLoaded && userLoaded) return null;

  return (
    <div>
      <BarLoader width={"100%"} className="m-4" color="#36d7b7" />
    </div>
  );
};

export default UserLoading;
