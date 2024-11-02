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
      fieldName: "status",
      required: true,
    },
    {
      fieldName: "userId",
      required: true,
    },
    {
      fieldName: "userName",
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
      fieldName: "name",
      required: true,
    },
    {
      fieldName: "status",
      required: true,
    },
  ],
};
