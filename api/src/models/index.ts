export type AuthorizationMatcher = {
  profile: string;
  bodyParam: string;
};

export type AuthorizationMatchers = {
  [key: string]: AuthorizationMatcher;
};

export type FiledDefinition = {
  fieldName: string;
  required: boolean;
  detailOnly: boolean;
};

export type Params = {
  path?: string;
  dynamoDb?: any;
  searchParams?: { [key: string]: string };
  requestKey?: string;
  body?: RequestBody;
  token?: string | null;
};

export type RequestBody = {
  [key: string]: string | number | boolean | object | null | undefined;
};

export type JwtPayload = {
  [key: string]: string;
};

export type ReturnPayload = {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
};
