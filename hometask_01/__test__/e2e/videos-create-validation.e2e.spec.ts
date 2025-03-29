// @ts-ignore
import request from "supertest";
import { setupApp } from "../../src/setup-app";
// @ts-ignore
import express from "express";
import { CreateVideoInputModel } from "../../src/videos/dto/videos.input-dto";
import { HttpStatus } from "../../src/core/types/http-statuses";
import { Resolutions } from "../../src/videos/types/videos";


describe("Videos API  create video validations check", () => {
  const app = express();
  setupApp(app);

  const testVideosData: CreateVideoInputModel = {
    title: "Top mem cats",
    author: "senorian2",
    availableResolutions: [Resolutions.P144],
  };

  beforeAll(async () => {
    await request(app).delete("/testing/all-data").expect(HttpStatus.NoContent);
  });

    it(`should not create videos when incorrect body passed; POST /videos'`, async () => {
        // Тест 1: Некорректный title
        const invalidDataSet1 = await request(app)
            .post("/videos")
            .send({
                ...testVideosData,
                title: "     ",
                author: "senorian2",
                availableResolutions: [Resolutions.P144],
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
        expect(invalidDataSet1.body.errorMessages[0].field).toBe("title");
        expect(invalidDataSet1.body.errorMessages[0].message).toBe("Invalid title");

        // Тест 2: Некорректный author
        const invalidDataSet2 = await request(app)
            .post("/videos")
            .send({
                ...testVideosData,
                title: "1234",
                author: "    ",
                availableResolutions: [Resolutions.P144],
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet2.body.errorMessages).toHaveLength(1);
        expect(invalidDataSet2.body.errorMessages[0].field).toBe("author");
        expect(invalidDataSet2.body.errorMessages[0].message).toBe("Invalid author");

        // Тест 3: Пустой массив Resolutions
        const invalidDataSet3 = await request(app)
            .post("/videos")
            .send({
                ...testVideosData,
                title: "1234",
                author: "senorian2",
                availableResolutions: [],
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet3.body.errorMessages).toHaveLength(1);
        expect(invalidDataSet3.body.errorMessages[0].field).toBe("Resolutions");
        expect(invalidDataSet3.body.errorMessages[0].message).toBe("Resolutions cannot be empty");

        // Тест 4: Resolutions не массив
        const invalidDataSet4 = await request(app)
            .post("/videos")
            .send({
                ...testVideosData,
                title: "1234",
                author: "senorian2",
                availableResolutions: "12323",
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet4.body.errorMessages).toHaveLength(1);
        expect(invalidDataSet4.body.errorMessages[0].field).toBe("Resolutions");
        expect(invalidDataSet4.body.errorMessages[0].message).toBe("Resolutions must be array");

        // Тест 5: Некорректное значение в Resolutions
        const invalidDataSet5 = await request(app)
            .post("/videos")
            .send({
                ...testVideosData,
                title: "1234",
                author: "senorian2",
                availableResolutions: ["144"],
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet5.body.errorMessages).toHaveLength(1);
        expect(invalidDataSet5.body.errorMessages[0].field).toBe("Resolutions");
        expect(invalidDataSet5.body.errorMessages[0].message).toBe("Invalid Resolutions: 144");
    });

});
