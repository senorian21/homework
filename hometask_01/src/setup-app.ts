import express, { Express, Request, Response } from "express";
import { testingRouter } from "./testing/routers/testing.router";
import { videosRouter } from "./videos/routers/videos.router";


export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.use("/testing", testingRouter);
  app.use("/videos", videosRouter);

  return app;
};
