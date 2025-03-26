import { Videos, Resolutions } from "../videos/types/videos";

export const db = {
  videos: <Videos>[
    {
      id: 0,
      title: "Top mem cats",
      author: "senorian2",
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: new Date(),
      publicationDate: new Date(),
      availableResolutions: Resolutions.P1440,
    },
    {
      id: 1,
      title: "Funny dogs",
      author: "animalfan",
      canBeDownloaded: false,
      minAgeRestriction: 12,
      createdAt: new Date(),
      publicationDate: new Date(),
      availableResolutions: Resolutions.P720,
    },
    {
      id: 2,
      title: "Funny frog",
      author: "animal",
      canBeDownloaded: false,
      minAgeRestriction: 12,
      createdAt: new Date(),
      publicationDate: new Date(),
      availableResolutions: Resolutions.P2160,
    },
  ],
};
