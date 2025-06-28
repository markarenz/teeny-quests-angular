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

// post and put for games and users REQUIRE AUTH
// -- check token sub against designated field
// -- game: userId
// -- user: id
// -- contentVersion: userId
// content version needs a userId field for this purpose
// NEXT - oAuth integration for x-access-token

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
