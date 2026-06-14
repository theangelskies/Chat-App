export const validateMessage = (data, next) => {
  const { text, username } = data;

  if (!text?.trim() || !username?.trim()) {
    return; // block message
  }

  next();
};
