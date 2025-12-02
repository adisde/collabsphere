export const inputValidator = (fields = [], body = {}) => {
  for (let f of fields) {
    const value = body[f];

    if (value === undefined || value === null) {
      return { ok: false, message: `${f} is required.` };
    }

    if (String(value).trim() === "") {
      return { ok: false, message: `${f} cannot be empty.` };
    }
  }

  return { ok: true };
};
