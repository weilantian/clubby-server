//修改个人信息
import { Prisma, Role, Sex } from "@prisma/client";
import { Context } from "../../context";
import { Application, Response, Request } from "express";
import reportError from "../../utils/reportError";
import signJwt from "../../utils/signJwt";
const updateUserInfo = async (req: Request, res: Response, ctx: Context) => {
  const { name, email, role, password, sex, roleName } = req.body;
  const userId = req.userData.id;
  try {
    const user = await ctx.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
        password,
        sex,
      },
    });

    return res.status(200).send({
      message: "User profile successfully updated",
      code: "OK",
      data: {
        name: user.name,
        email: user.email,
        sex: user.sex,
        activated: user.activated,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code == "P2002") {
        return res.status(401).send({
          message: "This email has been used by other accounts.",
          code: "EMAIL_EXISTED",
          data: {},
        });
      }
    }
    reportError(err, res);
  }
};

const getCurrentUserInfo = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  try {
    const user = await ctx.prisma.user.findFirst({
      where: { id: req.userData.id },
    });
    if (!user) {
      return res.status(401).send({
        message: "User not found",
        code: "NOT_FOUND",
        data: {},
      });
    }
    return res.status(200).send({
      message: "",
      code: "OK",
      data: {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        role: user!.role,
        roleName: user!.roleName,
        sex: user!.sex,
        jwt: signJwt(user),
        activated: user!.activated,
      },
    });
  } catch (err) {
    reportError(err, res);
  }
};

const getAllUsers = async (req: Request, res: Response, ctx: Context) => {
  try {
    const role = req.query["role"];
    const userList = [];
    const users = await ctx.prisma.user.findMany({
      where: { role: role as Role },
      include: {
        _count: {
          select: { atended: true },
        },
      },
    });

    for (const user of users) {
      userList.push({
        id: user!.id,
        name: user!.name,
        email: user!.email,
        role: user!.role,
        roleName: user!.roleName,
        sex: user!.sex,
        activated: user!.activated,
        attendedCount: user!._count!.atended,
      });
    }

    return res.status(200).send({
      message: "",
      code: "OK",
      data: userList,
    });
  } catch (err) {
    reportError(err, res);
  }
};

const getUserInfo = async (req: Request, res: Response, ctx: Context) => {
  try {
    const id = req.params.id;
    const user = await ctx.prisma.user.findFirst({
      where: {
        id,
      },
    });
    return res.status(200).send({
      code: "OK",
      message: "OK",
      data: {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        role: user!.role,
        roleName: user!.roleName,
        sex: user!.sex,
        activated: user!.activated,
      },
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

const updateOtherUserInfo = async (
  req: Request,
  res: Response,
  ctx: Context
) => {
  try {
    const id = req.params.id;
    const { name, email, role, password, sex, roleName } = req.body;
    const updateUserInfo = await ctx.prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        role,
        password,
        sex,
        roleName,
      },
    });
    return res.status(200).send({
      message: "OK",
      code: "OK",
      data: {
        ...updateUserInfo,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res.status(401).send({
          message: "Can not found the user",
          code: "NOT_FOUND",
          data: {},
        });
      } else if (e.code === "P2002") {
        return res.status(401).send({
          message: "This email has been used by other accounts.",
          code: "EMAIL_EXISTED",
          data: {},
        });
      }
    }
    reportError(e, res);
  }
};

export {
  updateUserInfo,
  getCurrentUserInfo,
  getUserInfo,
  getAllUsers,
  updateOtherUserInfo,
};
