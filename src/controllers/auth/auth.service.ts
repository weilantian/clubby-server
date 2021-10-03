import { Role, Sex } from "@prisma/client";
import { Context } from "../../context";
import { Application, Response, Request } from "express";
import jwt from "jsonwebtoken";
import config from "../../config";
import reportError from "../../utils/reportError";
import signJwt from "../../utils/signJwt";

const signUp = async (req: Request, res: Response, ctx: Context) => {
  const body = req.body;

  const existedUser = await ctx.prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });

  if (existedUser) {
    return res.status(401).send({
      message: "Email existed",
      code: "EMAIL_EXISTED",
      data: {},
    });
  }
  try {
    const user = await ctx.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        role: body.role as Role,
        password: body.password,
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
  } catch (err) {
    reportError(err, res);
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
    if (user.password != password) {
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

export { signUp, login, updatePIN };
