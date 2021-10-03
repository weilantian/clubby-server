import { Context } from "../../context";
import { Request, Response } from "express";
import reportError from "../../utils/reportError";
import { PrismaClient, Prisma } from "@prisma/client";

export const createInquiry = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  const isPublic = req.body["public"];
  const { title, content } = req.body;

  try {
    const inquiry = await ctx.prisma.inquiry.create({
      data: {
        title,
        content,
        public: isPublic,
        publisherId: req.userData.id,
      },
      include: {
        publishedBy: {
          select: {
            id: true,
            name: true,
            roleName: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).send({
      message: "OK",
      code: "OK",
      data: { ...inquiry },
    });
  } catch (err) {
    reportError(err, res);
  }
};

export const updateInquiry = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  //社团管理员与本人有权利修改
  const isPublic = req.body["public"];
  const { title, content } = req.body;
  const id = req.params.id;
  try {
    const hasPermission = await checkInquiryExists(id, ctx, req, res);
    if (hasPermission !== true) {
      return hasPermission;
    }

    const inquiry = await ctx.prisma.inquiry.update({
      where: {
        id,
      },
      data: {
        public: isPublic,
        title,
        content,
      },
      include: {
        publishedBy: {
          select: {
            id: true,
            name: true,
            roleName: true,
            role: true,
          },
        },
        answeredBy: {
          select: {
            id: true,
            name: true,
            roleName: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).send({
      message: "OK",
      code: "OK",
      data: { ...inquiry },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res.status(404).send({
          message: "Can not found the corresponding inquiry",
          code: "NOT_FOUND",
          data: {},
        });
      }
    }
    reportError(e, res);
  }
};

export const deleteInquiry = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  const id = req.params.id;
  try {
    const hasPermission = await checkInquiryExists(id, ctx, req, res);
    if (hasPermission !== true) {
      return hasPermission;
    }

    const inquiry = await ctx.prisma.inquiry.delete({
      where: {
        id,
      },
    });

    return res.status(200).send({
      message: "OK",
      code: "OK",
      data: {},
    });
  } catch (err) {
    reportError(err, res);
  }
};

//TODO: CURD
//TODO: 改为允许多人回答问题

//const updateInquiryAnswer = (req, res) => {};

export const removeInquiryAnswer = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  try {
    const id = req.params.id;
    const existedInquiry = await ctx.prisma.inquiry.findFirst({
      where: {
        id,
      },
    });

    if (!existedInquiry) {
      return res.status(404).send({
        message: "Can not found the corresponding inquiry",
        code: "NOT_FOUND",
        data: {},
      });
    }

    const removeInquiryAnswer = await ctx.prisma.inquiry.update({
      where: {
        id: existedInquiry.id,
      },
      data: {
        answer: "",
        answeredBy: {
          disconnect: true,
        },
      },
      include: {
        publishedBy: {
          select: {
            id: true,
            name: true,
            roleName: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).send({
      message: "OK",
      code: "OK",
      data: { ...removeInquiryAnswer },
    });
  } catch (err) {
    reportError(err, res);
  }
};

export const answerInquiry = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  try {
    const id = req.params.id;
    const answer = req.body.answer;

    const existedInquiry = await ctx.prisma.inquiry.findFirst({
      where: {
        id,
      },
    });

    if (!existedInquiry) {
      return res.status(404).send({
        message: "Can not found the corresponding inquiry",
        code: "NOT_FOUND",
        data: {},
      });
    }

    const updatedInquiry = await ctx.prisma.inquiry.update({
      where: {
        id: existedInquiry.id,
      },
      data: {
        answerUserId: req.userData.id,
        answer,
      },
      include: {
        answeredBy: {
          select: {
            id: true,
            name: true,
            roleName: true,
            role: true,
          },
        },
        publishedBy: {
          select: {
            id: true,
            name: true,
            roleName: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).send({
      message: "OK",
      code: "OK",
      data: { ...updatedInquiry },
    });
  } catch (err) {
    reportError(err, res);
  }
};

export const checkInquiryExists = async (
  id: string,
  ctx: Context,
  req: Request,
  res: Response
) => {
  const existedInquiry = await ctx.prisma.inquiry.findFirst({
    where: {
      id,
    },
  });

  if (!existedInquiry) {
    return res.status(404).send({
      message: "Can not found the corresponding inquiry",
      code: "NOT_FOUND",
      data: {},
    });
  }

  if (
    req.userData.id != existedInquiry!.publisherId &&
    req.userData.role != "ADMIN"
  ) {
    return res.status(404).send({
      message: "You don't have the permission",
      code: "NO_PERMISSIONS",
      data: {},
    });
  }

  return true;
};

export const getAllInquiries = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  try {
    const inqiures = await ctx.prisma.inquiry.findMany({
      where: {
        OR: [
          { publisherId: req.userData.id },
          { public: req.userData.role != "ADMIN" ? true : undefined },
        ],
      },
    });
    return res.status(200).send({
      message: "OK",
      code: "OK",
      data: { ...inqiures },
    });
  } catch (err) {
    reportError(err, res);
  }
};

export const getInquiry = async (req: Request, res: Response, ctx: Context) => {
  try {
    const id = req.params.id;
    const inquiry = await ctx.prisma.inquiry.findFirst({
      where: {
        id: id,
        OR: [
          { publisherId: req.userData.id },
          { public: req.userData.role != "ADMIN" ? true : undefined },
        ],
      },
    });
    return res.status(200).send({
      message: "OK",
      code: "OK",
      data: { ...inquiry },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res.status(404).send({
          message: "Can not found the corresponding inquiry",
          code: "NOT_FOUND",
          data: {},
        });
      }
    }
    reportError(e, res);
  }
};
