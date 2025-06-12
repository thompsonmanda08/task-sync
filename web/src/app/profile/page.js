import { getUserProfile } from "@/app/_actions/auth-actions";
import React from "react";
import AccountProfilePage from "./profile-tabs";
import { getAuthSession } from "@/app/_actions/config-actions";

async function ProfilePage() {
  const { isAuthenticated } = await getAuthSession();
  const profile = await getUserProfile(isAuthenticated);
  const user = profile.data;
  return (
    <div>
      <AccountProfilePage key={"profile-info"} user={user} />
    </div>
  );
}

export default ProfilePage;
