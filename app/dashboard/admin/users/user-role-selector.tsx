"use client";

import { useState } from "react";
import { Select } from "@/components/ui/select";
import { updateUserRole } from "@/app/actions/admin";
import { UserRole } from "@prisma/client";

type Props = {
  userId: string;
  currentRole: UserRole;
};

export default function UserRoleSelector({ userId, currentRole }: Props) {
  const [role, setRole] = useState(currentRole);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleChange = async (newRole: string) => {
    setIsUpdating(true);
    try {
      const result = await updateUserRole(userId, newRole as UserRole);
      if (result.success) {
        setRole(newRole as UserRole);
      }
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Select
      value={role}
      onChange={(e) => handleRoleChange(e.target.value)}
      disabled={isUpdating}
      className="w-48"
    >
      <option value="ADMIN">Admin</option>
      <option value="TEAM_MEMBER">Team Member</option>
      <option value="REQUISITIONER">Requisitioner</option>
    </Select>
  );
}
