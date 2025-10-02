"use client";

import { getOrganisationUsers } from "@/actions/ogranization";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/use-fetch";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { useOrganization } from "@clerk/nextjs";

interface AssigneeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  clerkUserId: string;
}

const AssigneeSelector = ({ value, onValueChange }: AssigneeSelectorProps) => {
  const { organization } = useOrganization();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const {
    data: dbUsers,
    isLoading: isFetchingUsers,
    fn: fetchUsers,
  } = useFetch(getOrganisationUsers);

  // Fetch team members when organization is available
  useEffect(() => {
    if (organization?.id) {
      fetchUsers(organization.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization?.id]);

  // Set team members when data is received
  useEffect(() => {
    if (dbUsers) {
      setTeamMembers(dbUsers);
    }
  }, [dbUsers]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const selectedMember = teamMembers.find((member) => member.clerkUserId === value);

  const handleValueChange = (newValue: string) => {
    // Convert "unassigned" back to empty string for the form
    const convertedValue = newValue === "unassigned" ? "" : newValue;
    if (convertedValue !== value) {
      onValueChange(convertedValue);
    }
  };

  // Stabilize the select value to prevent re-renders
  const selectValue = value || "unassigned";

  return (
    <FormItem>
      <FormLabel className="text-base font-semibold">Assignee</FormLabel>
      <Select 
        onValueChange={handleValueChange} 
        value={selectValue}
        disabled={isFetchingUsers}
      >
        <SelectTrigger>
          <SelectValue placeholder={isFetchingUsers ? "Loading..." : "Select assignee"}>
            {selectedMember ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={selectedMember.imageUrl} alt={selectedMember.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                    {getInitials(selectedMember.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{selectedMember.name}</span>
              </div>
            ) : value === "" || !value ? (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Unassigned</span>
              </div>
            ) : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unassigned">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Unassigned</span>
            </div>
          </SelectItem>
          {teamMembers.map((member) => (
            <SelectItem key={member.clerkUserId} value={member.clerkUserId}>
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={member.imageUrl} alt={member.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-xs text-muted-foreground">{member.email}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};

export default AssigneeSelector;