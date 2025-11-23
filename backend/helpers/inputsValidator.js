export const inputValidator = (fields = [], body = {}) => {
  for (let f of fields) {
    if (!body[f] || body[f].trim() === "") {
      return {
        ok: false,
        message: `${f} is required.`,
      };
    }
  }
  return { ok: true };
};
