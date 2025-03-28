import { CreateVideoInputModel } from "../dto/videos.input-dto";
import { ValidationError } from "../types/validationError";
import { Resolutions } from "../types/videos";

export const videoInputValidation = (
  data: CreateVideoInputModel,
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

  return errors;
};
