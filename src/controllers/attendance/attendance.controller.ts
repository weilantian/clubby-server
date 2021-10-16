import { createContext } from "../../context";
import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import auth from "../../middleware/auth";
import { RelationalObjectValidator } from "../../lib/validators/relational-object.validator";
import reportUnexpectedRequest from "../../utils/reportUnexpectedRequest";
import {
  addPersonToAttendanceRecord,
  createAttendanceRecord,
  deletePersonToAttendanceRecord,
  getAllAttendanceRecords,
  getAttendanceRecord,
} from "./attendance.service";

const ctx = createContext();
const AttendanceController: Router = Router();

AttendanceController.post(
  "/",
  checkSchema({
    attended: {
      custom: {
        options: (attended) => {
          return RelationalObjectValidator(attended, false);
        },
      },
    },
  }),
  auth(["ADMIN"]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return createAttendanceRecord(req, res, ctx);
  }
);

AttendanceController.patch(
  "/:id/add",
  checkSchema({
    id: { in: ["params"], isUUID: true },
    userId: { in: ["body"], isUUID: true },
  }),
  auth(["ADMIN"]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return addPersonToAttendanceRecord(req, res, ctx);
  }
);

AttendanceController.patch(
  "/:id/remove",
  checkSchema({
    id: { in: ["params"], isUUID: true },
    userId: { in: ["body"], isUUID: true },
  }),
  auth(["ADMIN"]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return deletePersonToAttendanceRecord(req, res, ctx);
  }
);

AttendanceController.get(
  "/",
  auth(["ADMIN"]),
  (req: Request, res: Response) => {
    return getAllAttendanceRecords(req, res, ctx);
  }
);

AttendanceController.get(
  "/:id",
  checkSchema({
    id: { in: ["params"], isUUID: true },
  }),
  auth(["ADMIN"]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return getAttendanceRecord(req, res, ctx);
  }
);

export default AttendanceController;
