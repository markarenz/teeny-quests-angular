export const tableNames = {
  games: "prod-tq-games",
  users: "prod-tq-users",
};

export const fieldNames = {
  games: [
    {
      fieldName: "id",
      required: false,
    },
    {
      fieldName: "itemStatus",
      required: true,
    },
    {
      fieldName: "userId",
      required: true,
    },
    {
      fieldName: "username",
      required: true,
    },
    {
      fieldName: "title",
      required: true,
    },
    {
      fieldName: "description",
      required: true,
    },
    {
      fieldName: "introduction",
      required: true,
    },
    {
      fieldName: "rating",
      required: true,
    },
    {
      fieldName: "content",
      required: true,
    },
  ],
  users: [
    {
      fieldName: "id",
      required: false,
    },
    {
      fieldName: "username",
      required: true,
    },
    {
      fieldName: "itemStatus",
      required: true,
    },
  ],
};
