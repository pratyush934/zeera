'use client';

import { OrganizationList, useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const OnBoarding = () => {
  const { organization } = useOrganization();
  const router = useRouter();

  useEffect(() => {
    if (organization) {
      router.push(`/organization/${organization.slug}`);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  return (
    <div className="flex justify-center items-center h-[80%] pt-12">
      <OrganizationList
        afterCreateOrganizationUrl={`/organization/:slug`}
        afterSelectOrganizationUrl={`/organization/:slug`}
      />
    </div>
  );
};

export default OnBoarding;
