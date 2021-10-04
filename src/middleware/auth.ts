import jwt from "jsonwebtoken";
import config from "../config";
import { Application, Response, Request } from "express";

export default (
  credentials: Array<string> = [],
  ignoreActivation?: boolean | false
) => {
  return (req: Request, res: Response, next: () => void) => {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).send({
        message: "JWT have not be provided",
        code: "JWT_RESIGN_REQUIRED",
        data: {},
      });
    }

    const tokenBody = token.slice(7);

    jwt.verify(tokenBody, config.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "JWT might be expired",
          code: "JWT_RESIGN_REQUIRED",
          data: {},
        });
      }
      req.userData = decoded!;
      if (!req.userData.activated && !ignoreActivation) {
        return res.status(401).send({
          message: "The account has not been activated.",
          code: "ACCOUNT_NOT_ACTIVATED",
          data: { name: req.userData.name },
        });
      }
      if (credentials.length > 0) {
        if (
          decoded! &&
          credentials.some((cred) => decoded!.scopes.indexOf(cred) >= 0)
        ) {
          next();
        } else {
          return res.status(401).send({
            message: "JWT might be expired",
            code: "JWT_RESIGN_REQUIRED",
            data: {},
          });
        }
      } else {
        next();
      }
    });
  };
};
