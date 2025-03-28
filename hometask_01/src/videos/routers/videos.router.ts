import express, { Express, Request, Response } from "express";
import { db } from "../../db/in-memory.db";
import { HttpStatus } from "../../core/types/http-statuses";
import { Router } from "express";

import { videoInputValidation } from "../validation/videoInputValidation";
import { videoUpdateValidation } from "../validation/videoUpdateValidation";
import { createErrorMessages } from "../../core/utils/error.utils";

import { Videos, Resolutions, Video } from "../types/videos";

export const videosRouter = Router({});

videosRouter
  .get("", (req: Request, res: Response) => {
    res.set({
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      Expires: "0",
    });
    res.status(HttpStatus.Ok).send(db.videos);
  })

  .get("/:id", (req: Request, res: Response) => {
    res.set({
      "Cache-Control": "no-store", // Отключить кэширование
      Pragma: "no-cache", // Совместимость с HTTP/1.0
      Expires: "0", // Устаревший, но иногда полезный заголовок
    });
    let id = +req.params.id;
    const searchVideo = db.videos.find((v) => v.id === id);

    if (!searchVideo) {
      res.status(HttpStatus.NotFound).send(
        createErrorMessages([
          {
            field: "id",
            message: "Videos not found",
          },
        ]),
      );
      return;
    }

    res.status(HttpStatus.Ok).send(searchVideo);
  })

  .delete("/:id", (req: Request, res: Response) => {
    const deletedVideo = db.videos.find((v) => v.id === +req.params.id);
    if (!deletedVideo) {
      res.sendStatus(HttpStatus.NotFound); // Отправляет только код 404
      return; // Завершает выполнение, чтобы не продолжать выполнение следующего кода
    }
    db.videos = db.videos.filter((v) => v.id !== +req.params.id);
    res.sendStatus(HttpStatus.NoContent); // Отправляет код 204
  })

  .post("", (req: Request, res: Response) => {
    const errors = videoInputValidation(req.body);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
      return;
    }

    const date = new Date();
    const createdAt = date.toISOString();
    const date2 = new Date(createdAt);
    date2.setDate(date2.getDate() + 1);
    const publicationDate = date2.toISOString();
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
      availableResolutions: req.body.availableResolutions,
    };

    db.videos.push(newVideo);

    res.status(HttpStatus.Created).send(newVideo);
  })

  .put("/:id", (req: Request, res: Response) => {
    const errors = videoUpdateValidation(req.body);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
      return;
    }

    let video = db.videos.find((v) => v.id === +req.params.id);
    if (!video) {
      res.status(HttpStatus.NotFound).send({ error: "Video not found" });
      return;
    }

    const publicationDate = new Date(req.body.publicationDate).toISOString();

    const updateVideo: Video = {
      id: video.id,
      title: req.body.title,
      author: req.body.author,
      canBeDownloaded: req.body.canBeDownloaded,
      minAgeRestriction: req.body.minAgeRestriction,
      createdAt: video.createdAt,
      publicationDate: publicationDate,
      availableResolutions: req.body.availableResolutions,
    };
    db.videos = db.videos.map((v) =>
      v.id === +req.params.id ? updateVideo : v,
    );
    res.sendStatus(HttpStatus.NoContent);
  });
