import authRouter from "./authRoutes.js";
import contactUsRouter from "./contactUsRoutes.js";
import adminRouter from "./adminRoutes.js";
import assessmentRouter from "./assessmentRoutes.js";
import graduateRouter from "./graduateRoutes.js";
import companyRouter from "./companyRoutes.js";
import notificationRouter from "./notificationRoutes.js";
import offerRouter from "./offerJobRoute.js";

export const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1", contactUsRouter);
  app.use("/api/v1/admins", adminRouter);
  app.use("/api/v1/assessments", assessmentRouter);
  app.use("/api/v1/graduates", graduateRouter);
  app.use("/api/v1/company", companyRouter);
  app.use("/api/v1/notifications", notificationRouter);
  app.use("/api/v1/offers", offerRouter);
};