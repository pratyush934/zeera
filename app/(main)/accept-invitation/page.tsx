"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const organizationName = searchParams.get("org") || "the organization";
  const inviterName = searchParams.get("inviter") || "the team";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl">Invitation Accepted!</CardTitle>
            <CardDescription className="text-base">
              Welcome to {organizationName}! You've successfully joined the team.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Invitation from {inviterName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                Organization Member
              </Badge>
            </div>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              You can now access projects, create issues, and collaborate with your team members.
            </p>
            
            <div className="flex flex-col gap-3">
              <Link href="/onboarding">
                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Go to Organizations
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const AcceptInvitationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInvitationContent />
    </Suspense>
  );
};

export default AcceptInvitationPage;