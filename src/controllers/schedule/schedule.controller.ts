import { createContext } from "../../context";
import { Request, Response, Router } from "express";
import { checkSchema, Schema, validationResult } from "express-validator";
import auth from "../../middleware/auth";
import reportUnexpectedRequest from "../../utils/reportUnexpectedRequest";
import {
  createSchedule,
  deleteSchedule,
  getSchedules,
  updateSchedule,
} from "./schedule.service";
import { RelationalObjectValidator } from "../../lib/validators/relational-object.validator";

const ctx = createContext();
const ScheduleController: Router = Router();

const scheduleInputSchema: Schema = {
  name: {
    isString: true,
  },
  date: {
    isString: true,
  },
  startTime: {
    isString: true,
  },
  endTime: {
    isString: true,
  },
  type: {
    isString: true,
  },
  custom_type: {
    isString: true,
    optional: { options: { nullable: true } },
  },
  description: {
    isString: true,
  },
  fileLinks: {
    isString: true,
    optional: { options: { nullable: true } },
  },
  courseId: {
    isUUID: true,
    optional: { options: { nullable: true } },
  },
  participators: {
    custom: {
      options: (participators) => {
        return RelationalObjectValidator(participators, true);
      },
    },
  },
};

ScheduleController.post(
  "/",
  checkSchema({
    ...scheduleInputSchema,
  }),
  auth(["ADMIN"]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return createSchedule(req, res, ctx);
  }
);

ScheduleController.patch(
  "/:id",
  checkSchema({
    id: { in: ["params"], isUUID: true },
    ...scheduleInputSchema,
  }),
  auth(["ADMIN"]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return updateSchedule(req, res, ctx);
  }
);

ScheduleController.delete(
  "/:id",
  checkSchema({
    id: { in: ["params"], isUUID: true },
  }),
  auth(["ADMIN"]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return deleteSchedule(req, res, ctx);
  }
);

ScheduleController.get("/", auth([]), (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
  return getSchedules(req, res, ctx);
});

export default ScheduleController;
