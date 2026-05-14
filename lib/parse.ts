export const toNumber = (value: string | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const toBoolean = (value: string | null | undefined) => {
  if (value === null || value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};
