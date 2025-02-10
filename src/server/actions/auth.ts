"use server";

export const login = async (emailOrPhone: string) => {
  return {
    emailOrPhone,
  };
};
