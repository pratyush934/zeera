"use client";

import { getOrganisationUsers } from "@/actions/ogranization";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFetch } from "@/hooks/use-fetch";
import { Crown, Mail, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useOrganization } from "@clerk/nextjs";

interface TeamMembersListProps {
  organizationId: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  role?: string;
}

const TeamMembersList = ({ organizationId }: TeamMembersListProps) => {
  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
    },
  });
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const {
    data: dbUsers,
    isLoading: isFetchingUsers,
    fn: fetchUsers,
  } = useFetch(getOrganisationUsers);

  // Fetch database users
  useEffect(() => {
    fetchUsers(organizationId);
  }, [organizationId, fetchUsers]);

  // Combine Clerk membership data with database user data
  useEffect(() => {
    if (dbUsers && memberships?.data) {
      const combinedMembers: TeamMember[] = dbUsers.map((dbUser) => {
        const clerkMember = memberships.data.find(
          (member) => member.publicUserData?.userId === dbUser.clerkUserId
        );
        
        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          imageUrl: dbUser.imageUrl,
          role: clerkMember?.role || "org:member",
        };
      });
      
      setTeamMembers(combinedMembers);
    }
  }, [dbUsers, memberships?.data]);

  const getRoleBadge = (role: string) => {
    return role === "org:admin" ? (
      <Badge variant="destructive" className="text-xs">
        <Crown className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">
        <User className="h-3 w-3 mr-1" />
        Member
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isFetchingUsers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>
            Loading team members...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Team Members
          {teamMembers.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {teamMembers.length}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Manage your organization team members and their roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        {teamMembers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No team members found</p>
            <p className="text-sm">
              Invite members to start collaborating on projects.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.imageUrl} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-base">{member.name}</span>
                      {getRoleBadge(member.role || "org:member")}
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{member.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {member.role === "org:admin" && (
                    <Badge variant="outline" className="text-xs">
                      Organization Admin
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamMembersList;