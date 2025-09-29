"use client";

import {
  OrganizationSwitcher,
  SignedIn,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const OrgSwitcher = () => {
  const { user, isLoaded: userLoaded } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const router = useRouter();

  // Redirect to onboarding if no organization is selected
  useEffect(() => {
    if (userLoaded && !organization) {
      router.push("/onboarding");
    }
  }, [userLoaded, organization, router]);

  // Show loading while user and organization data is being fetched
  if (!userLoaded || !orgLoaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <BarLoader width={200} color="#36d7b7" />
      </div>
    );
  }

  // If user is not authenticated, don't show the switcher
  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center">
      <SignedIn>
        <OrganizationSwitcher
          appearance={{
            elements: {
              organizationSwitcherTrigger:
                "p-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground",
              organizationSwitcherTriggerIcon: "text-muted-foreground",
            },
          }}
          afterCreateOrganizationUrl={(org) => `/organization/${org.slug}`}
          afterSelectOrganizationUrl={(org) => `/organization/${org.slug}`}
          afterLeaveOrganizationUrl="/onboarding"
          createOrganizationMode="modal"
          organizationProfileMode="modal"
          hidePersonal={false}
        />
      </SignedIn>
    </div>
  );
};

export default OrgSwitcher;
