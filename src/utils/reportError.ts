import { Response } from "express";

const reportError = (err: unknown, res: Response) => {
  console.log(err);
  return res.status(502).send({
    message: "Internal Server Error",
    code: "INTERNAL_ERROR",
    data: {},
  });
};

export default reportError;
