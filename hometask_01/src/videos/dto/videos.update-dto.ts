import { Resolutions } from "../types/videos";

export type UpdateVideoInputModel = {
  title: string;
  author: string;
  availableResolutions: Resolutions[];
  canBeDownloaded: boolean;
  minAgeRestriction: number;
  publicationDate: Date;
};
