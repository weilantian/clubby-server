//Has init
//INIT (INCLUDES CREATE FIRST ACCOUNT)
//UPDATE

import { createContext } from "../../context";
import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import { configureClubInfo, getClubInfo, updateClubInfo } from "./club.service";
import auth from "../../middleware/auth";
import reportUnexpectedRequest from "../../utils/reportUnexpectedRequest";

const ctx = createContext();
const ClubInfoController: Router = Router();

ClubInfoController.get(
  "/",
  checkSchema({
    clubId: {
      in: ["query"],
      optional: { options: { nullable: true } },
      isUUID: true,
    },
  }),
  auth([]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return getClubInfo(req, res, ctx);
  }
);

ClubInfoController.post(
  "/",
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
    },
    description: {
      notEmpty: true,
      isString: true,
    },
    type: {
      notEmpty: true,
      isString: true,
    },
    designedMemberCount: {
      isInt: true,
      toInt: true,
    },
  }),
  auth(["ADMIN"]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return configureClubInfo(req, res, ctx);
  }
);

ClubInfoController.patch(
  "/",
  checkSchema({
    name: {
      isString: true,
      optional: { options: { nullable: true } },
    },
    description: {
      isString: true,
      optional: { options: { nullable: true } },
    },
    type: {
      isString: true,
      optional: { options: { nullable: true } },
    },
    designedMemberCount: {
      isInt: true,
      toInt: true,
      optional: { options: { nullable: true } },
    },
  }),
  auth(["ADMIN"]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return updateClubInfo(req, res, ctx);
  }
);

export default ClubInfoController;
