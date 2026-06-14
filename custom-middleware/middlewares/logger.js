export const logger = (socket, next) => {
  console.log("New socket connection:", socket.id);
  next();
};
