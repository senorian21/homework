// @ts-ignore
import request from "supertest";
import { app } from "../../src/index";
import { CreateVideoInputModel } from "../../src/videos/dto/videos.input-dto";
import { HttpStatus } from "../../src/core/types/http-statuses";
import { Resolutions } from "../../src/videos/types/videos";
import { db } from "../../src/db/in-memory.db";
import { UpdateVideoInputModel } from "../../src/videos/dto/videos.update-dto";

describe("Videos API", () => {
  const testVideosData: CreateVideoInputModel = {
    title: "Top mem cats",
    author: "senorian2",
    availableResolutions: [Resolutions.P144],
  };

  beforeAll(async () => {
    await request(app).delete("/testing/all-data").expect(HttpStatus.NoContent);
  });

  it("should create a video; POST /videos", async () => {
    const newVideos: CreateVideoInputModel = {
      ...testVideosData,
      title: "Valentinka",
      author: "Valentin",
      availableResolutions: [Resolutions.P1440],
    };

    const createdVideosResponse = await request(app)
      .post("/videos")
      .send(newVideos)
      .expect(HttpStatus.Created);

    expect(createdVideosResponse.body.availableResolutions).toEqual([
      Resolutions.P1440,
    ]);
    expect(createdVideosResponse.body.title).toBe(newVideos.title);
    expect(createdVideosResponse.body.author).toBe(newVideos.author);
  });

  it("should return videos list; GET /videos", async () => {
    await request(app)
      .post("/videos")
      .send({ ...testVideosData, title: "Another1" })
      .expect(HttpStatus.Created);

    await request(app)
      .post("/videos")
      .send({ ...testVideosData, title: "Another2" })
      .expect(HttpStatus.Created);

    const driverListResponse = await request(app)
      .get("/videos")
      .expect(HttpStatus.Ok);

    expect(db.videos).toBeInstanceOf(Array);
    expect(db.videos.length).toBeGreaterThanOrEqual(2);
  });

  it("should return driver by id; GET /videos/:id", async () => {
    const createResponse = await request(app)
      .post("/videos")
      .send({ ...testVideosData, title: "Another3" })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`/videos/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        createdAt: expect.any(String),
        title: "Another3",
      }),
    );
  });

  it("should update a video; PUT /videos/:id", async () => {
    const createResponse = await request(app)
      .post("/videos")
      .send(testVideosData)
      .expect(HttpStatus.Created);

    const videoId = createResponse.body.id;

    const date = new Date();

    const updateVideos1: UpdateVideoInputModel = {
      ...testVideosData,
      title: "update",
      author: "Valentin123",
      availableResolutions: [
        Resolutions.P2160,
        Resolutions.P480,
        Resolutions.P360,
      ],
      canBeDownloaded: true,
      minAgeRestriction: 18,
      publicationDate: date.toISOString(),
    };

    // Обновить видео
    await request(app)
      .put(`/videos/${videoId}`)
      .send(updateVideos1)
      .expect(HttpStatus.NoContent);

    // Получить обновлённое видео
    const getResponse = await request(app)
      .get(`/videos/${videoId}`)
      .expect(HttpStatus.Ok);

    // Проверить данные
    expect(getResponse.body).toEqual(
      expect.objectContaining({
        title: "update",
        author: "Valentin123",
        availableResolutions: [
          Resolutions.P2160,
          Resolutions.P480,
          Resolutions.P360,
        ],
        canBeDownloaded: true,
        minAgeRestriction: 18,
        publicationDate: date.toISOString(),
      }),
    );
  });

  it("delete video; DELETE /videos/:id", async () => {
    const createResponse = await request(app)
      .post("/videos")
      .send(testVideosData)
      .expect(HttpStatus.Created);

    const videoId = createResponse.body.id;

    await request(app)
      .delete(`/videos/${videoId}`)
      .expect(HttpStatus.NoContent);
  });
});
