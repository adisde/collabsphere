export const passwordValidator = (password) => {
  if (!password || password.trim().length < 8) {
    return {
      ok: false,
      message: "Password must be at least 8 characters.",
    };
  }
  return {
    ok: true,
  };
};
