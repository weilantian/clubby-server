import UserInfoController from "./controllers/userInfo/userInfo.controller";
import { Application, Router } from "express";
import AuthController from "./controllers/auth/auth.controller";
import ClubInfoController from "./controllers/club/club.controller";
import InquiryController from "./controllers/inquiry/inquiry.controller";
import CourseController from "./controllers/course/course.controller";
import ScheduleController from "./controllers/schedule/schedule.controller";

const _routes: [string, Router][] = [
  ["/api/auth", AuthController],
  ["/api/user", UserInfoController],
  ["/api/info", ClubInfoController],
  ["/api/inquiry", InquiryController],
  ["/api/course", CourseController],
  ["/api/schedule", ScheduleController],
];

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, controller] = route;
    app.use(url, controller);
  });
};
