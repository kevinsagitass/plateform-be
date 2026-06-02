const ROLE_HIERARCHY = {
  OWNER: 1,
  ADMIN: 2,
  STORE_MANAGER: 3,
  CASHIER: 4,
  COOK: 5,
};

export const getHighestRole = (roles) => {
  if (!roles || roles.length === 0) return null;

  const validRoles = roles.filter((role) => role in ROLE_HIERARCHY);
  if (validRoles.length === 0) return null;

  return validRoles.reduce((highest, current) =>
    ROLE_HIERARCHY[current] < ROLE_HIERARCHY[highest] ? current : highest
  );
};

export const getLowestRole = (roles) => {
  if (!roles || roles.length === 0) return null;

  const validRoles = roles.filter((role) => role in ROLE_HIERARCHY);
  if (validRoles.length === 0) return null;

  return validRoles.reduce((lowest, current) =>
    ROLE_HIERARCHY[current] > ROLE_HIERARCHY[lowest] ? current : lowest
  );
};