import { Request, Response } from "express";
import { Context } from "../../context";
import reportError from "../../utils/reportError";
import { Prisma } from "@prisma/client";

export const createSchedule = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  const {
    date,
    name,
    startTime,
    endTime,
    courseId,
    type,
    custom_type,
    description,
    participators,
    fileLinks,
  } = req.body;
  try {
    let schedule = await ctx.prisma.schedule.create({
      data: {
        name,
        date,
        startTime,
        endTime,
        type,
        custom_type,
        description,
        fileLinks,
        participator: {
          connect: [...participators],
        },
        course: {
          connect: courseId ? { id: courseId } : undefined,
        },
      },
      include: {
        course: {
          select: {
            name: true,
            id: true,
          },
        },
        participator: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return res.status(200).send({
      code: "OK",
      message: "OK",
      data: { ...schedule },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res.status(404).send({
          message: "Can not found the members",
          code: "NOT_FOUND",
          data: {},
        });
      }
    }
    reportError(e, res);
  }
};

export const updateSchedule = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  const id = req.params.id;
  const {
    date,
    name,
    startTime,
    endTime,
    courseId,
    type,
    custom_type,
    description,
    participators,
    fileLinks,
  } = req.body;
  try {
    let schedule = await ctx.prisma.schedule.update({
      where: {
        id,
      },
      data: {
        name,
        date,
        startTime,
        endTime,
        type,
        custom_type,
        description,
        fileLinks,
        participator: {
          set: [...participators],
        },
        course: {
          connect: courseId ? { id: courseId } : undefined,
          disconnect: !courseId ? true : undefined,
        },
      },
      include: {
        course: {
          select: {
            name: true,
            id: true,
          },
        },
        participator: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return res.status(200).send({
      message: "Schedule updated successfully",
      code: "OK",
      data: { ...schedule },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res.status(404).send({
          message: "Can not found the members",
          code: "NOT_FOUND",
          data: {},
        });
      }
    }
    reportError(e, res);
  }
};

export const deleteSchedule = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  const id = req.params.id;
  try {
    let schedule = await ctx.prisma.schedule.delete({
      where: {
        id,
      },
      include: {
        course: {
          select: {
            name: true,
            id: true,
          },
        },
        participator: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return res.status(200).send({
      message: "Schedule deleted successfully",
      code: "OK",
      data: { ...schedule },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res.status(404).send({
          message: "Can not found the schedule",
          code: "NOT_FOUND",
          data: {},
        });
      }
    }
    reportError(e, res);
  }
};

export const getSchedules = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  try {
    const schedules = await ctx.prisma.schedule.findMany({
      where: {
        published: req.userData.scopes.includes("ADMIN") ? undefined : true,
      },
      include: {
        course: {
          select: {
            name: true,
            id: true,
          },
        },
        participator: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return res.status(200).send({
      message: "OK",
      code: "OK",
      data: { ...schedules },
    });
  } catch (e) {
    reportError(e, res);
  }
};
