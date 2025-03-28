import { CreateVideoInputModel } from "../../videos/dto/videos.input-dto";
import { UpdateVideoInputModel } from "../../videos/dto/videos.update-dto";

export type ValidationError = {
  field: string;
  message: string;
};
export const videoInputValidation = (
  data: CreateVideoInputModel,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  return errors;
};
