"use client";

import { getOrganizationInvitations, revokeOrganizationInvitation } from "@/actions/ogranization";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetch } from "@/hooks/use-fetch";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Mail, Shield, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface InvitationsListProps {
  organizationId: string;
}

interface Invitation {
  id: string;
  emailAddress: string;
  role: string;
  status?: string;
  createdAt: number;
}

const InvitationsList = ({ organizationId }: InvitationsListProps) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const {
    data: invitationsData,
    isLoading: isFetching,
    fn: fetchInvitations,
  } = useFetch(getOrganizationInvitations);
  
  const {
    data: revokeResult,
    isLoading: isRevoking,
    fn: revokeInvitation,
  } = useFetch(revokeOrganizationInvitation);

  // Fetch invitations on mount
  useEffect(() => {
    fetchInvitations(organizationId);
  }, [organizationId, fetchInvitations]);

  // Update invitations when data is received
  useEffect(() => {
    if (invitationsData?.success && invitationsData.invitations) {
      setInvitations(invitationsData.invitations);
    }
  }, [invitationsData]);

  // Handle revoke result
  useEffect(() => {
    if (revokeResult?.success) {
      toast.success(revokeResult.message);
      // Refresh the invitations list
      fetchInvitations(organizationId);
    }
    if (revokeResult?.error) {
      toast.error(revokeResult.error);
    }
  }, [revokeResult, fetchInvitations, organizationId]);

  const handleRevokeInvitation = async (invitationId: string) => {
    if (confirm("Are you sure you want to revoke this invitation?")) {
      await revokeInvitation({
        organizationId,
        invitationId,
      });
    }
  };

  const getRoleBadge = (role: string) => {
    return role === "org:admin" ? (
      <Badge variant="destructive" className="text-xs">
        <Shield className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">
        <User className="h-3 w-3 mr-1" />
        Member
      </Badge>
    );
  };

  if (isFetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Pending Invitations
          </CardTitle>
          <CardDescription>
            Loading pending invitations...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-600" />
          Pending Invitations
          {invitations.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {invitations.length}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Manage pending invitations to join your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invitations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No pending invitations</p>
            <p className="text-sm">
              All invitations have been accepted or there are no pending invites.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{invitation.emailAddress}</span>
                      {getRoleBadge(invitation.role)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          Invited {new Date(invitation.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        <span className="capitalize">{invitation.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokeInvitation(invitation.id)}
                    disabled={isRevoking}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvitationsList;