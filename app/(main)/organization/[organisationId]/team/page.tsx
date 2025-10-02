import { getOrganization } from "@/actions/ogranization";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import InvitationsList from "../_components/invitations-list";
import OrganizationHeader from "../_components/organization-header";
import TeamMembersList from "../_components/team-members-list";

const TeamPage = async ({
  params,
}: {
  params: Promise<{ organisationId: string }>;
}) => {
  const { organisationId } = await params;

  const organisation = await getOrganization(organisationId);

  if (!organisation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Organization Not Found</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          The organization you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to access it.
        </p>
        <Link href="/onboarding">
          <Button>Back to Organizations</Button>
        </Link>
      </div>
    );
  }

  // Serialize the organization data for client component
  const serializedOrg = {
    id: organisation.id,
    name: organisation.name,
    createdAt: organisation.createdAt,
  };

  return (
    <div className="space-y-8">
      {/* Organization Header */}
      <OrganizationHeader organisation={serializedOrg} />

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 rounded-lg bg-muted p-1">
          <Link href={`/organization/${organisation.id}`}>
            <Button variant="ghost" size="sm" className="rounded-md">
              Projects
            </Button>
          </Link>
          <Button variant="default" size="sm" className="rounded-md">
            Team
          </Button>
          <Button variant="ghost" size="sm" className="rounded-md" disabled>
            Analytics
          </Button>
          <Button variant="ghost" size="sm" className="rounded-md" disabled>
            Settings
          </Button>
        </div>
      </div>

      <Separator />

      {/* Team Management Content */}
      <div className="space-y-6">
        <TeamMembersList organizationId={organisation.id} />
        <InvitationsList organizationId={organisation.id} />
      </div>
    </div>
  );
};

export default TeamPage;