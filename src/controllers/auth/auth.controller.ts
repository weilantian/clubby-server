import { signUp, login, updatePIN, activateAccount } from "./auth.service";
import { Application, Response, Request } from "express";
import { createContext } from "../../context";
import { Router } from "express";
import auth from "../../middleware/auth";
import { checkSchema, body, validationResult } from "express-validator";
import reportUnexpectedRequest from "../../utils/reportUnexpectedRequest";
const ctx = createContext();

const AuthController: Router = Router();

AuthController.post(
  "/signUp",
  checkSchema({
    name: {
      in: ["body"],
      isLength: {
        options: { min: 2, max: 14 },
      },
    },
    email: {
      in: ["body"],
      isEmail: true,
      errorMessage: "Can not found email",
    },
    password: {
      isLength: {
        options: { min: 12, max: 32 },
      },
      optional: { options: { nullable: true } },
    },
    sex: {
      notEmpty: true,
    },
    role: {
      notEmpty: true,
    },
  }),
  auth(["ADMIN"]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return signUp(req, res, ctx);
  }
);

AuthController.post(
  "/login",
  checkSchema({
    email: {
      in: ["body"],
      isEmail: true,
    },
    password: {
      isLength: {
        options: { min: 12, max: 32 },
      },
    },
  }),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return login(req, res, ctx);
  }
);

AuthController.post(
  "/updatePIN",
  checkSchema({
    email: {
      in: ["body"],
      isEmail: true,
    },
    oldPassword: {
      isLength: {
        options: { min: 12, max: 32 },
      },
    },
    newPassword: {
      isLength: {
        options: { min: 12, max: 32 },
      },
    },
  }),
  auth([]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return reportUnexpectedRequest(req, res);
    }
    if (req.userData.email != req.body.email) {
      return res.status(401).send({
        message: "You can't change other user's password",
        errors: errors.array(),
        code: "UNEXPECTED_REQUEST",
      });
    }

    return updatePIN(req, res, ctx);
  }
);

AuthController.post(
  "/activate",
  checkSchema({
    newPassword: {
      in: ["body"],
      isLength: {
        options: { min: 12, max: 32 },
      },
    },
  }),
  auth([], true),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return reportUnexpectedRequest(req, res);
    }
    return activateAccount(req, res, ctx);
  }
);

//TODO: 批量注册功能

export default AuthController;
