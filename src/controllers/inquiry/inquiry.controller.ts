import { createContext } from "../../context";
import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import reportUnexpectedRequest from "../../utils/reportUnexpectedRequest";
import {
  answerInquiry,
  createInquiry,
  deleteInquiry,
  getAllInquiries,
  getInquiry,
  removeInquiryAnswer,
  updateInquiry,
} from "./inquiry.service";
import auth from "../../middleware/auth";

const ctx = createContext();
const InquiryController: Router = Router();

InquiryController.post(
  "/",
  checkSchema({
    public: {
      isBoolean: true,
      toBoolean: true,
    },
    title: {
      isString: true,
    },
    content: {
      isString: true,
    },
  }),
  auth([]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return createInquiry(req, res, ctx);
  }
);

InquiryController.patch(
  "/:id",
  checkSchema({
    id: {
      isUUID: true,
      in: ["params"],
    },

    public: {
      isBoolean: true,
      toBoolean: true,
      optional: { options: { nullable: true } },
    },
    title: {
      isString: true,
      optional: { options: { nullable: true } },
    },
    content: {
      isString: true,
      optional: { options: { nullable: true } },
    },
  }),
  auth([]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return updateInquiry(req, res, ctx);
  }
);

InquiryController.post(
  "/:id/answer",
  checkSchema({
    id: {
      isUUID: true,
      in: ["params"],
    },
    answer: {
      in: ["body"],
      isString: true,
    },
  }),
  auth(["ADMIN"]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return answerInquiry(req, res, ctx);
  }
);

InquiryController.delete(
  "/:id/answer",
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
    return removeInquiryAnswer(req, res, ctx);
  }
);

InquiryController.delete(
  "/:id",
  checkSchema({
    id: {
      isUUID: true,
      in: ["params"],
    },
  }),
  auth([]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return deleteInquiry(req, res, ctx);
  }
);

InquiryController.get("/", auth([]), (req: Request, res: Response) => {
  return getAllInquiries(req, res, ctx);
});

InquiryController.get(
  "/:id",
  checkSchema({
    id: {
      isUUID: true,
      in: ["params"],
    },
  }),
  auth([]),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return reportUnexpectedRequest(req, res);
    return getInquiry(req, res, ctx);
  }
);

export default InquiryController;
