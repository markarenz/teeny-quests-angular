import { apiGatewayId } from './configConstants';

export const baseApiUrl = `https://${apiGatewayId}.execute-api.us-east-1.amazonaws.com/prod`;

export const usersApiUrl = `${baseApiUrl}/users`;
export const gamesApiUrl = `${baseApiUrl}/games`;
export const versionsApiUrl = `${baseApiUrl}/versions`;
export const defaultGridSize = 7;
export const maxAreaCellHeight = 24;
export const areaHeightFactor = 0.5;
export const STANDARD_MOVE_DURATION = 100;
