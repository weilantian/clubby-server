import { Request, Response } from "express";
import { Context } from "../../context";
import { Prisma } from "@prisma/client";
import reportError from "../../utils/reportError";
import prisma from "../../client";

export const createAttendanceRecord = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  const { attended } = req.body;
  try {
    let attendanceRecord = await ctx.prisma.attendanceRecord.create({
      data: {
        attended: {
          connect: [...attended],
        },
      },
      include: {
        attended: {
          select: {
            name: true,
            id: true,
          },
        },
        _count: {
          select: {
            attended: true,
          },
        },
      },
    });
    return res.status(200).send({
      code: "OK",
      message: "OK",
      data: {
        ...attendanceRecord,
        total: attendanceRecord._count!.attended,
      },
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

export const deletePersonToAttendanceRecord = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const record = await ctx.prisma.attendanceRecord.update({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            attended: true,
          },
        },
        attended: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      data: {
        attended: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
    return res.status(200).send({
      code: "OK",
      message: "OK",
      data: {
        ...record,
        total: record._count!.attended,
      },
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

//del
//add
export const addPersonToAttendanceRecord = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const record = await ctx.prisma.attendanceRecord.update({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            attended: true,
          },
        },
        attended: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      data: {
        attended: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return res.status(200).send({
      code: "OK",
      message: "OK",
      data: {
        ...record,
        total: record._count!.attended,
      },
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

export const getAllAttendanceRecords = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  try {
    const records = await ctx.prisma.attendanceRecord.findMany({
      include: {
        _count: {
          select: {
            attended: true,
          },
        },
      },
    });
    const recordList = [];
    for (const record of records) {
      recordList.push({
        id: record.id,
        date: record.date,
        count: record._count!.attended,
      });
    }
    res.status(200).send({
      message: "OK",
      code: "OK",
      data: recordList,
    });
  } catch (e) {
    reportError(e, res);
  }

  //TODO:日后推出分页功能
};

export const getAttendanceRecord = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  const { id } = req.params;
  try {
    const record = await ctx.prisma.attendanceRecord.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            attended: true,
          },
        },
        attended: {
          select: {
            name: true,
            id: true,
            role: true,
          },
        },
      },
    });
    res.status(200).send({
      message: "OK",
      code: "OK",
      data: { ...record, count: record!._count!.attended },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res.status(404).send({
          message: "Can not found the user",
          code: "NOT_FOUND",
          data: {},
        });
      }
    }
    reportError(e, res);
  }
};

export const checkAttendance = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  const { id } = req.body;
  try {
    const attendanceCount = await ctx.prisma.attendanceRecord.count({
      where: {
        attended: {
          some: {
            id,
          },
        },
      },
    });
    const attendance = await ctx.prisma.attendanceRecord.findMany({
      where: {
        attended: {
          some: {
            id,
          },
        },
      },
    });
    return res.status(200).send({
      code: "OK",
      message: "OK",
      data: {
        count: attendanceCount,
        attendance: [...attendance],
      },
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
