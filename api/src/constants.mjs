export const tableNames = {
  games: "TQ_Games",
  users: "TQ_Users",
  contentVersions: "TQ_ContentVersions",
};

export const indexNames = {
  games_get: "itemStatusIndex",
  games_get_userId: "gamesByUserIndex",
  users_get: "itemStatusIndex",
};

export const authorizationMatchers = {
  users_post: {
    profile: "sub",
    bodyParam: "id",
  },
  games_post: {
    profile: "sub",
    bodyParam: "userId",
  },
  games_put: {
    profile: "sub",
    bodyParam: "userId",
  },
};

export const fieldNames = {
  games: [
    {
      fieldName: "id",
      required: false,
      detailOnly: false,
    },
    {
      fieldName: "itemStatus",
      required: true,
      detailOnly: false,
    },
    {
      fieldName: "userId",
      required: true,
      detailOnly: false,
    },
    {
      fieldName: "username",
      required: true,
      detailOnly: false,
    },
    {
      fieldName: "title",
      required: true,
      detailOnly: false,
    },
    {
      fieldName: "description",
      required: true,
      detailOnly: false,
    },
    {
      fieldName: "introduction",
      required: true,
      detailOnly: true,
    },
    {
      fieldName: "rating",
      required: true,
      detailOnly: false,
    },
    {
      fieldName: "content",
      required: true,
      detailOnly: true,
    },
  ],
  contentVersions: [
    {
      fieldName: "id",
      required: false,
      detailOnly: false,
    },
    {
      fieldName: "gameId",
      required: true,
      detailOnly: false,
    },
    {
      fieldName: "version",
      required: true,
      detailOnly: false,
    },
    {
      fieldName: "content",
      required: true,
      detailOnly: false,
    },
  ],
  users: [
    {
      fieldName: "id",
      required: false,
      detailOnly: false,
    },
    {
      fieldName: "username",
      required: true,
      detailOnly: false,
    },
    {
      fieldName: "itemStatus",
      required: true,
      detailOnly: false,
    },
  ],
};
