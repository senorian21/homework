// @ts-ignore
import request from "supertest";
import {setupApp} from "../../src/setup-app";
// @ts-ignore
import express from "express";
import {UpdateVideoInputModel} from "../../src/videos/dto/videos.update-dto";
import {Resolutions} from "../../src/videos/types/videos";
import {HttpStatus} from "../../src/core/types/http-statuses";
import { CreateVideoInputModel } from "../../src/videos/dto/videos.input-dto";

describe("Videos API  create video validations check", () => {
    const app = express();
    setupApp(app);
    const testVideosDataUpdate : UpdateVideoInputModel = {
        title: "string",
        author: "string",
        availableResolutions: [
            Resolutions.P144
        ],
        canBeDownloaded: true,
        minAgeRestriction: 18,
        publicationDate: "2025-03-29T12:43:08.117Z"
    }

    const testVideosDataCreate: CreateVideoInputModel = {
        title: "Top mem cats",
        author: "senorian2",
        availableResolutions: [Resolutions.P144],
    };

    beforeAll(async () => {
        await request(app).delete("/testing/all-data").expect(HttpStatus.NoContent);
    });


    it("should not update video when availableResolutions is empty; PUT /videos/:id", async () => {
        const createResponse = await request(app)
            .post("/videos")
            .send(testVideosDataCreate)
            .expect(HttpStatus.Created);

        const videoId = createResponse.body.id;

        const invalidUpdateData: UpdateVideoInputModel = {
            ...testVideosDataUpdate,
            availableResolutions: [],
        };

        const response = await request(app)
            .put(`/videos/${videoId}`)
            .send(invalidUpdateData)
            .expect(HttpStatus.BadRequest);

        expect(response.body.errorMessages).toHaveLength(1);
        expect(response.body.errorMessages[0].field).toBe("Resolutions");
        expect(response.body.errorMessages[0].message).toBe("Resolutions cannot be empty");
    });


    it("should not update video when minAgeRestriction is out of range; PUT /videos/:id", async () => {
        const createResponse = await request(app)
            .post("/videos")
            .send(testVideosDataCreate)
            .expect(HttpStatus.Created);

        const videoId = createResponse.body.id;

        const invalidUpdateData: UpdateVideoInputModel = {
            ...testVideosDataUpdate,
            minAgeRestriction: 19,
        };

        const response = await request(app)
            .put(`/videos/${videoId}`)
            .send(invalidUpdateData)
            .expect(HttpStatus.BadRequest);

        expect(response.body.errorMessages).toHaveLength(1);
        expect(response.body.errorMessages[0].field).toBe("minAgeRestriction");
        expect(response.body.errorMessages[0].message).toBe("Invalid minAgeRestriction: ");
    });

    it("should not update video when publicationDate is invalid; PUT /videos/:id", async () => {
        const createResponse = await request(app)
            .post("/videos")
            .send(testVideosDataCreate)
            .expect(HttpStatus.Created);

        const videoId = createResponse.body.id;

        const invalidUpdateData: UpdateVideoInputModel = {
            ...testVideosDataUpdate,
            publicationDate: "i12323123",
        };

        const response = await request(app)
            .put(`/videos/${videoId}`)
            .send(invalidUpdateData)
            .expect(HttpStatus.BadRequest);

        expect(response.body.errorMessages).toHaveLength(1);
        expect(response.body.errorMessages[0].field).toBe("publicationDate");
        expect(response.body.errorMessages[0].message).toBe("Invalid publicationDate");
    });

})