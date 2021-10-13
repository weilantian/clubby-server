import { createContext } from "../../context";
import { Request, Response, Router } from "express";
import { checkSchema, Schema, validationResult } from "express-validator";
import auth from "../../middleware/auth";
import reportUnexpectedRequest from "../../utils/reportUnexpectedRequest";
import {
  createCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
} from "./course.service";

const ctx = createContext();
const CourseController: Router = Router();

const sharedSchema: Schema = {
  name: {
    notEmpty: true,
    isString: true,
  },
  content: {
    isString: true,
  },
  fileLinks: {
    isString: true,
    optional: { options: { nullable: true } },
  },
  published: {
    isBoolean: true,
    toBoolean: true,
    optional: { options: { nullable: true } },
  },
};

CourseController.post(
  "/",
  checkSchema({
    ...sharedSchema,
  }),
  auth(["ADMIN"]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return createCourse(req, res, ctx);
  }
);

CourseController.patch(
  "/:id",
  checkSchema({
    ...sharedSchema,
    id: {
      isUUID: true,
      in: ["params"],
    },
  }),
  auth(["ADMIN"]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return updateCourse(req, res, ctx);
  }
);

CourseController.delete(
  "/:id",
  checkSchema({
    id: {
      isUUID: true,
      in: ["params"],
    },
  }),
  auth(["ADMIN"]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return deleteCourse(req, res, ctx);
  }
);

CourseController.get("/", auth([]), (req: Request, res: Response) => {
  return getCourses(req, res, ctx);
});

CourseController.get(
  "/:id",
  checkSchema({
    id: {
      in: ["params"],
      isUUID: true,
    },
  }),
  auth([]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return getCourse(req, res, ctx);
  }
);
export default CourseController;
