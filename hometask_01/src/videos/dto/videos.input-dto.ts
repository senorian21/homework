import { Resolutions } from "../types/videos";

export type CreateVideoInputModel = {
  title: string;
  author: string;
  availableResolutions: Resolutions[];
};
