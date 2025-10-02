"use client";

import OrgSwitcher from "@/components/org-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Settings, Users } from "lucide-react";
import { useState } from "react";
import InviteMembersModal from "./invite-members-modal";
interface OrganizationHeaderProps {
  organisation: {
    id: string;
    name: string;
    createdAt: number;
  };
}

const OrganizationHeader = ({ organisation }: OrganizationHeaderProps) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <>
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 rounded-xl" />
        
        <Card className="relative border-0 shadow-sm bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
          <CardHeader className="pb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left Section - Organization Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {organisation.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {organisation.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        Organization
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <CardDescription className="text-base max-w-2xl">
                  Welcome to your organization dashboard. Manage projects, collaborate with your team, 
                  and track progress across all your initiatives.
                </CardDescription>

                {/* Quick Stats */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created {new Date(organisation.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Team Workspace</span>
                  </div>
                </div>
              </div>

              {/* Right Section - Actions & Switcher */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-end">
                {/* Organization Switcher */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Switch Organization
                  </span>
                  <OrgSwitcher />
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsInviteModalOpen(true)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Invite Members
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Invite Members Modal */}
      <InviteMembersModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        organizationId={organisation.id}
        organizationName={organisation.name}
      />
    </>
  );
};

export default OrganizationHeader;