import { environmment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: true,
  BASE_URL: 'https://c360.zone/ceewell',
  REST_API_URL:'https://c360.zone/ceewell_api'
};
