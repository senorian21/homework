import express, { Express, Request, Response } from "express";
import { db } from "./db/in-memory.db";
import { HttpStatus } from "./core/types/http-statuses";

import { videoInputValidation } from "./videos/validation/videoInputValidation";
import { videoUpdateValidation } from "./videos/validation/videoUpdateValidation";
import { createErrorMessages } from "./core/utils/error.utils";

import { testingRouter } from "./testing/routers/testing.router";
import { videosRouter } from "./videos/routers/videos.router";

import { Videos, Resolutions, Video } from "./videos/types/videos";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.use("/testing", testingRouter);
  app.use("/videos", videosRouter);

  return app;
};
