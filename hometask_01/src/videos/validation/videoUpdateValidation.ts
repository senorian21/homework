import { UpdateVideoInputModel } from "../dto/videos.update-dto";
import { ValidationError } from "../types/validationError";
import { Resolutions } from "../types/videos";

export const videoUpdateValidation = (
  data: UpdateVideoInputModel,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (
    !data.title ||
    typeof data.title !== "string" ||
    data.title.trim().length > 40
  ) {
    errors.push({ field: "title", message: "Invalid title" });
  }

  if (
    !data.author ||
    typeof data.author !== "string" ||
    data.author.trim().length > 20
  ) {
    errors.push({ field: "author", message: "Invalid author" });
  }

  if (!Array.isArray(data.availableResolutions)) {
    errors.push({
      field: "Resolutions",
      message: "Resolutions must be array",
    });
  } else if (data.availableResolutions.length) {
    const existingResolutions = Object.values(Resolutions);
    if (
      data.availableResolutions.length > existingResolutions.length ||
      data.availableResolutions.length < 1
    ) {
      errors.push({
        field: "Resolutions",
        message: "Invalid Resolutions",
      });
    }
    for (const resolution of data.availableResolutions) {
      if (!existingResolutions.includes(resolution)) {
        errors.push({
          field: "Resolutions",
          message: "Invalid Resolutions: " + resolution,
        });
        break;
      }
    }
  }

  if (typeof data.canBeDownloaded !== "boolean") {
    errors.push({
      field: "canBeDownloaded",
      message: "Invalid canBeDownloaded: ",
    });
  }

  if (
    data.minAgeRestriction < 1 ||
    data.minAgeRestriction > 18 ||
    typeof data.minAgeRestriction !== "number"
  ) {
    errors.push({
      field: "minAgeRestriction",
      message: "Invalid minAgeRestriction: ",
    });
  }

  if (
    typeof data.publicationDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(
      data.publicationDate,
    ) || // Регулярное выражение для проверки ISO 8601
    isNaN(Date.parse(data.publicationDate))
  ) {
    errors.push({
      field: "publicationDate",
      message: "Invalid publicationDate",
    });
  }

  return errors;
};
