import authRouter from "./authRoutes.js";
import contactUsRouter from "./contactUsRoutes.js";
import adminRouter from "./adminRoutes.js";
import assessmentRouter from "./assessmentRoutes.js";
import graduateRouter from "./graduateRoutes.js";
import roadMapRouter from "./roadMapRoutes.js";
import phaseRouter from "./phaseRoutes.js";
import resourceRouter from "./resourceRoutes.js";
import offerRouter from "./offerJobRoute.js";
import quizRouter from "./quizRoutes.js";
import questionRouter from "./questionRoutes.js";

// Mount routers
export const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/contactUs", contactUsRouter);
  app.use("/api/v1/admins", adminRouter);
  app.use("/api/v1/assessments", assessmentRouter);
  app.use("/api/v1/graduates", graduateRouter);
  app.use("/api/v1/roadmaps", roadMapRouter);
  app.use("/api/v1/phases", phaseRouter);
  app.use("/api/v1/resources", resourceRouter);
  app.use("/api/v1/offers", offerRouter);
  app.use("/api/v1/quiz", quizRouter);
  app.use("/api/v1/questions", questionRouter);
};
