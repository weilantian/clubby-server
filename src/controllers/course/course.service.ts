import { Request, Response } from "express";
import { Context } from "../../context";
import reportError from "../../utils/reportError";
import { Prisma } from "@prisma/client";

export const createCourse = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  try {
    const { name, content, fileLinks, published } = req.body;
    const course = await ctx.prisma.course.create({
      data: {
        name,
        content,
        fileLinks,
        published,
      },
    });
    return res.status(200).send({
      message: "OK",
      code: "OK",
      data: { ...course },
    });
  } catch (e) {
    reportError(e, res);
  }
};

export const updateCourse = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  const id = req.params.id;
  const { name, content, fileLinks, published } = req.body;
  try {
    const course = await ctx.prisma.course.update({
      where: {
        id,
      },
      data: {
        name,
        content,
        fileLinks,
        published,
      },
    });
    return res.status(200).send({
      message: "OK",
      code: "OK",
      data: { ...course },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res.status(404).send({
          message: "Can not found the corresponding course",
          code: "NOT_FOUND",
          data: {},
        });
      }
    }
    reportError(e, res);
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  const id = req.params.id;
  try {
    await ctx.prisma.course.delete({ where: { id } });
    return res.status(200).send({
      data: {},
      code: "OK",
      message: "OK",
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res.status(404).send({
          message: "Can not found the corresponding course",
          code: "NOT_FOUND",
          data: {},
        });
      }
    }
    reportError(e, res);
  }
};

export const getCourses = async (req: Request, res: Response, ctx: Context) => {
  try {
    const courses = await ctx.prisma.course.findMany({
      where: {
        published: req.userData.scopes.includes("ADMIN") ? undefined : true,
      },
    });
    return res.status(200).send({
      message: "OK",
      code: "OK",
      data: [...courses],
    });
  } catch (e) {
    reportError(e, res);
  }
};

export const getCourse = async (req: Request, res: Response, ctx: Context) => {
  try {
    const id = req.params.id;
    const course = await ctx.prisma.course.findFirst({
      where: {
        id,
      },
    });
    return res.status(200).send({
      code: "OK",
      message: "OK",
      data: { ...course },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res.status(404).send({
          message: "Can not found the corresponding course",
          code: "NOT_FOUND",
          data: {},
        });
      }
    }
    reportError(e, res);
  }
};
