export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone: string) => {
  return /^[\d\s\-\+\(\)]{10,}$/.test(phone);
};

export const isValidDate = (value: string | Date) => {
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed > new Date();
};
