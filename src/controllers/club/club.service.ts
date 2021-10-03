import { Request, Response } from "express";
import { Context } from "../../context";
import reportError from "../../utils/reportError";

const getClubInfo = async (req: Request, res: Response, ctx: Context) => {
  const { clubId } = req.body;
  try {
    const existedClubInfo = await ctx.prisma.clubInfo.findFirst({
      where: {
        id: clubId,
      },
    });

    if (!existedClubInfo) {
      return res.status(200).send({
        message: "Requires configurations",
        code: "CONFIGURATION_REQUIRED",
        data: {},
      });
    }

    const adminCount = await ctx.prisma.user.count({
      where: {
        role: "ADMIN",
      },
    });
    const memberCount = await ctx.prisma.user.count({
      where: {
        role: "MEMBER",
      },
    });
    const totalCount = adminCount + memberCount;

    return res.status(200).send({
      message: "OK",
      code: "OK",
      data: {
        ...existedClubInfo,
        totalCount,
        memberCount,
        adminCount,
      },
    });
  } catch (err) {
    reportError(err, res);
  }
};

const configureClubInfo = async (req: Request, res: Response, ctx: Context) => {
  const { name, description, type, designedMemberCount } = req.body;
  try {
    const existedClubInfo = await ctx.prisma.clubInfo.findFirst({
      where: { id: "default" },
    });

    if (existedClubInfo)
      return res.status(200).send({
        message: "Club already configured",
        code: "CLUB_CONFIGURED",
        data: {},
      });

    const createdClubInfo = await ctx.prisma.clubInfo.create({
      data: {
        name,
        description,
        type,
        designedMemberCount,
      },
    });

    return res.status(200).send({
      message: "OK",
      code: "OK",
      data: {
        ...createdClubInfo,
      },
    });
  } catch (err) {
    reportError(err, res);
  }
};

const updateClubInfo = async (req: Request, res: Response, ctx: Context) => {
  const { name, description, type, designedMemberCount } = req.body;
  try {
    const existedClubInfo = await ctx.prisma.clubInfo.findFirst({
      where: { id: "default" },
    });

    if (!existedClubInfo)
      return res.status(200).send({
        message: "Requires configurations",
        code: "CONFIGURATION_REQUIRED",
        data: {},
      });

    const updatedClubInfo = await ctx.prisma.clubInfo.update({
      where: {
        id: "default",
      },
      data: {
        name,
        description,
        type,
        designedMemberCount,
      },
    });

    return res.status(200).send({
      message: "OK",
      code: "OK",
      data: {
        ...updatedClubInfo,
      },
    });
  } catch (err) {
    reportError(err, res);
  }
};

export { getClubInfo, configureClubInfo, updateClubInfo };
