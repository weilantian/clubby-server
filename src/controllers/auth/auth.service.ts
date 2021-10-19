import { Prisma, Role, Sex } from "@prisma/client";
import { Context } from "../../context";
import { Application, Response, Request } from "express";
import jwt from "jsonwebtoken";
import config from "../../config";
import reportError from "../../utils/reportError";
import signJwt from "../../utils/signJwt";
import bcrypt from "bcrypt";
const signUp = async (req: Request, res: Response, ctx: Context) => {
  const body = req.body;
  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await ctx.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        role: body.role as Role,
        password: hashedPassword,
        sex: body.sex as Sex,
        roleName: body.roleName,
      },
    });

    //Sign JWT
    return res.status(200).send({
      message: "Sign up successful",
      code: "OK",
      data: {
        id: user!.id,
        name: user.name,
        email: user.email,
        role: user.role,
        roleName: user.roleName,
        sex: user.sex,
        jwt: signJwt(user),
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res.status(401).send({
          code: "EMAIL_EXISTED",
          message: "Email has been used by other accounts.",
          data: {},
        });
      }
    }
    reportError(e, res);
  }
};

const login = async (req: Request, res: Response, ctx: Context) => {
  const body = req.body;
  const { email, password } = body;
  try {
    const user = await ctx.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res
        .status(401)
        .send({ message: "Can not login", code: "AUTH_FAILED", data: {} });
    }
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .send({ message: "Can not login", code: "AUTH_FAILED", data: {} });
    }

    return res.status(200).send({
      message: "Login successful",
      code: "OK",
      data: {
        id: user!.id,
        name: user.name,
        email: user.email,
        role: user.role,
        roleName: user.roleName,
        sex: user.sex,
        jwt: signJwt(user),
        activated: user.activated,
      },
    });
  } catch (err) {
    reportError(err, res);
  }
};

const updatePIN = async (req: Request, res: Response, ctx: Context) => {
  const body = req.body;
  const { email, oldPassword, newPassword } = body;
  try {
    const user = await ctx.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res
        .status(401)
        .send({ message: "Can not login", code: "AUTH_FAILED", data: {} });
    }

    if (user.password != oldPassword) {
      return res.status(401).send({
        message: "Can not login",
        code: "MISMATCHED_OLD_PASS",
        data: {},
      });
    }

    await ctx.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newPassword,
      },
    });

    return res.status(401).send({
      message: "Success",
      code: "OK",
      data: {},
    });
  } catch (err) {
    reportError(err, res);
  }
};

const activateAccount = async (req: Request, res: Response, ctx: Context) => {
  const { newPassword } = req.body;
  try {
    const user = await ctx.prisma.user.update({
      where: {
        id: req.userData.id,
      },
      data: {
        password: newPassword,
        activated: true,
      },
    });
    return res.status(200).send({
      message: "OK",
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

export { signUp, login, updatePIN, activateAccount };
