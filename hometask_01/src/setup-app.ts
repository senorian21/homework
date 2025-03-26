import express, { Express, Request, Response } from "express";
import { db } from "./db/in-memory.db";
import { HttpStatus } from "./core/types/http-statuses";
import { Videos, Resolutions, Video } from "./videos/types/videos";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.get("/videos", (req: Request, res: Response) => {
    res.set({
      "Cache-Control": "no-store", // Отключить кэширование
      Pragma: "no-cache", // Совместимость с HTTP/1.0
      Expires: "0", // Устаревший, но иногда полезный заголовок
    });

    res.status(HttpStatus.Ok).send(db.videos);
  });

  app.get("/videos/:id", (req: Request, res: Response) => {
    res.set({
      "Cache-Control": "no-store", // Отключить кэширование
      Pragma: "no-cache", // Совместимость с HTTP/1.0
      Expires: "0", // Устаревший, но иногда полезный заголовок
    });
    const searchVideo = db.videos.find((v) => v.id === +req.params.id);
    res.status(HttpStatus.Ok).send(searchVideo);
  });

  app.delete("/videos/:id", (req: Request, res: Response) => {
    db.videos.splice(+req.params.id, 1);
    res.send(HttpStatus.NoContent);
  });

  app.delete("/testing/all-data", (req: Request, res: Response) => {
    db.videos = [];
    res.send(HttpStatus.NoContent);
  });

  app.post("/videos", (req: Request, res: Response) => {
    const createdAt = new Date();
    const publicationDate = new Date(createdAt);
    publicationDate.setDate(publicationDate.getDate() + 1);
    const newId =
      db.videos.length > 0 ? db.videos[db.videos.length - 1].id + 1 : 0;

    const newVideo: Video = {
      id: newId,
      title: req.body.title,
      author: req.body.author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: createdAt,
      publicationDate: publicationDate,
      availableResolutions: req.body.resolutions,
    };

    db.videos.push(newVideo);

    res.status(HttpStatus.Created).send(newVideo);
  });

  app.put("/videos/:id", (req: Request, res: Response) => {
    let video = db.videos.find((v) => v.id === +req.params.id);

    if (!video) {
      res.status(404).send({ error: "Video not found" });
      return; // Возвращаем ошибку, если ID не существует
    }

    const updateVideo: Video = {
      id: video.id,
      title: req.body.title,
      author: req.body.author,
      canBeDownloaded: req.body.canBeDownloaded,
      minAgeRestriction: req.body.minAgeRestriction,
      createdAt: video.createdAt,
      publicationDate: req.body.publicationDate,
      availableResolutions: req.body.resolutions,
    };
    db.videos = db.videos.map((v) => (v.id === +req.params.id ? updateVideo : v));
    res.send(HttpStatus.NoContent)
  });

  return app;
};
