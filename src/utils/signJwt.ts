import jwt from "jsonwebtoken";
import config from "../config";

export default (user: {
  name: string;
  email: string;
  id: string;
  role: string;
}) => {
  const jwtPayload = {
    name: user.name,
    email: user.email,
    id: user.id,
    scopes: [user.role],
  };

  return jwt.sign(jwtPayload, config.JWT_KEY);
};
