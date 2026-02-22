export const USER_ROLES = {
  CLIENT: "cliente",
  COLLABORATOR: "colaborador",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
