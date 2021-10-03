import { createMember } from "./auth.service";
import { prismaMock } from "./../../singleton";
import { Role, Sex } from "@prisma/client";
import { Context } from "../../context";
import { MockContext, createMockContext } from "../../context";

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

test("should create new user", async () => {
  const user = {
    id: "0000-0000-0000-0000",
    name: "lantian",
    email: "weilantian2016@icloud.com",
    password: "xIaolan20020801",
    sex: "MALE" as Sex,
    role: "MEMBER" as Role,
    roleName: "MEMBER",
  };
  prismaMock.user.create.mockResolvedValue(user);
  const result = await createMember(user, ctx);
  expect(result).toEqual(user);
});
