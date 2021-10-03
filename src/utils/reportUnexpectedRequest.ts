import { Request, Response } from "express";
import { validationResult } from "express-validator";

const reportUnexpectedRequest = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(401).send({
      message: "Missing properties",
      errors: errors.array(),
      code: "UNEXPECTED_REQUEST",
    });
};

export default reportUnexpectedRequest;
