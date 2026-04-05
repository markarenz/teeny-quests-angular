import { AuthorizationMatchers, FiledDefinition } from './models';

export const tableNames: Record<string, string> = {
  games: 'TQ_Games',
  users: 'TQ_Users',
  versions: 'TQ_ContentVersions',
  activity: 'TQ_Activity',
};

export const fallbackOnCreate: Record<string, string> = {
  activity_post: 'updateGameActivityStats',
};

export const indexNames: Record<string, string> = {
  games_get: 'itemStatusIndex',
  games_get_userId: 'gamesByUserIndex',
  users_get: 'itemStatusIndex',
  versions_get_gameId: 'versionsByGameIndex',
  activity_get: 'activityByGameAndActivityIndex',
};

export const authorizationMatchers: AuthorizationMatchers = {
  users_post: {
    profile: 'sub',
    bodyParam: 'id',
  },
  games_post: {
    profile: 'sub',
    bodyParam: 'userId',
  },
  games_put: {
    profile: 'sub',
    bodyParam: 'userId',
  },
  versions_post: {
    profile: 'sub',
    bodyParam: 'userId',
  },
  activity_post: {
    // Empty values = no need for authorization
    profile: '',
    bodyParam: '',
  },
};

export const fieldNames: Record<string, FiledDefinition[]> = {
  games: [
    {
      fieldName: 'id',
      required: false,
      detailOnly: false,
    },
    {
      fieldName: 'itemStatus',
      required: true,
      detailOnly: false,
    },
    {
      fieldName: 'userId',
      required: true,
      detailOnly: false,
    },
    {
      fieldName: 'username',
      required: true,
      detailOnly: false,
    },
    {
      fieldName: 'title',
      required: true,
      detailOnly: false,
    },
    {
      fieldName: 'description',
      required: true,
      detailOnly: false,
    },
    {
      fieldName: 'introduction',
      required: false,
      detailOnly: true,
    },
    {
      fieldName: 'rating',
      required: true,
      detailOnly: false,
    },
    {
      fieldName: 'playCount',
      required: false,
      detailOnly: false,
    },
    {
      fieldName: 'completionCount',
      required: false,
      detailOnly: false,
    },
    {
      fieldName: 'content',
      required: true,
      detailOnly: true,
    },
  ],
  versions: [
    {
      fieldName: 'id',
      required: false,
      detailOnly: false,
    },
    {
      fieldName: 'gameId',
      required: true,
      detailOnly: false,
    },
    {
      fieldName: 'userId',
      required: true,
      detailOnly: false,
    },
    {
      fieldName: 'content',
      required: true,
      detailOnly: false,
    },
  ],
  users: [
    {
      fieldName: 'id',
      required: false,
      detailOnly: false,
    },
    {
      fieldName: 'username',
      required: true,
      detailOnly: false,
    },
    {
      fieldName: 'itemStatus',
      required: true,
      detailOnly: false,
    },
  ],
  activity: [
    {
      fieldName: 'gameId',
      required: true,
      detailOnly: false,
    },
    {
      fieldName: 'action',
      required: true,
      detailOnly: false,
    },
    {
      fieldName: 'gameIdActivity',
      required: true,
      detailOnly: false,
    },
    {
      fieldName: 'userId',
      required: false,
      detailOnly: false,
    },
    {
      fieldName: 'userLabel',
      required: false,
      detailOnly: false,
    },
    {
      fieldName: 'score',
      required: false,
      detailOnly: false,
    },
    {
      fieldName: 'dateTime',
      required: true,
      detailOnly: true,
    },
  ],
};
