import { Videos, Resolutions } from "../videos/types/videos";

export const db = {
  videos: <Videos>[
    {
      id: 0,
      title: "Top mem cats",
      author: "senorian2",
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: "2025-03-28T15:10:29.469Z",
      publicationDate: "2025-03-28T15:10:29.469Z",
      availableResolutions: [Resolutions.P1440],
    },
    {
      id: 1,
      title: "Funny dogs",
      author: "animalfan",
      canBeDownloaded: false,
      minAgeRestriction: 12,
      createdAt: "2025-03-28T15:10:29.469Z",
      publicationDate: "2025-03-28T15:10:29.469Z",
      availableResolutions: [Resolutions.P720],
    },
    {
      id: 2,
      title: "Funny frog",
      author: "animal",
      canBeDownloaded: false,
      minAgeRestriction: 12,
      createdAt: "2025-03-28T15:10:29.469Z",
      publicationDate: "2025-03-28T15:10:29.469Z",
      availableResolutions: [Resolutions.P2160],
    },
  ],
};
