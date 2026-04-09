import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAuth } from "@/auth/useAuth";

export default function Account() {
  const { accessToken, logout } = useAuth();

  return (
    <div className="mx-auto min-h-dvh max-w-5xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Protected area (requires auth)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Access token present:{" "}
            <span className="font-medium">{accessToken ? "yes" : "no"}</span>
          </div>
          <Button type="button" variant="outline" onClick={logout}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
