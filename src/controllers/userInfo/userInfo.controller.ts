import { createContext } from "../../context";
import { Application, Response, Request, Router } from "express";
import { checkSchema, Schema, validationResult } from "express-validator";
import {
  getAllUsers,
  getCurrentUserInfo,
  getUserInfo,
  updateOtherUserInfo,
  updateUserInfo,
} from "./userinfo.service";
import auth from "../../middleware/auth";
import reportUnexpectedRequest from "../../utils/reportUnexpectedRequest";
const UserInfoController: Router = Router();
const ctx = createContext();
import signJwt from "../../utils/signJwt";
const sharedSchema: Schema = {
  name: {
    in: ["body"],
    optional: { options: { nullable: true } },
    isLength: {
      options: { min: 2, max: 14 },
    },
  },
  email: {
    in: ["body"],
    isEmail: true,
    optional: { options: { nullable: true } },
    errorMessage: "Can not found email",
  },
  password: {
    optional: { options: { nullable: true } },
    isLength: {
      options: { min: 12, max: 32 },
    },
  },
  sex: {
    optional: { options: { nullable: true } },
    isString: true,
  },
};
UserInfoController.patch(
  "/current",
  checkSchema({
    ...sharedSchema,
  }),
  auth([]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return updateUserInfo(req, res, ctx);
  }
);

UserInfoController.patch(
  "/:id",
  checkSchema({
    id: {
      in: ["params"],
      isUUID: true,
    },
    ...sharedSchema,
  }),
  auth(["ADMIN"]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return updateOtherUserInfo(req, res, ctx);
  }
);

UserInfoController.get("/current", auth([]), (req: Request, res: Response) => {
  return getCurrentUserInfo(req, res, ctx);
});

UserInfoController.get(
  "/",
  checkSchema({
    role: {
      in: ["query"],
      optional: { options: { nullable: true } },
      custom: {
        options: (value) => {
          const roles = ["ADMIN", "MEMBER"];
          return roles.includes(value);
        },
      },
    },
  }),
  auth([]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return getAllUsers(req, res, ctx);
  }
);

UserInfoController.get(
  "/:id",
  checkSchema({
    id: {
      isUUID: true,
      in: ["params"],
    },
  }),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return getUserInfo(req, res, ctx);
  }
);

//TODO:添加拼音点名以及其签到

export default UserInfoController;
