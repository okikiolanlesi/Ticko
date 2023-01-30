import dotenv from "dotenv";

dotenv.config();

interface IAuth0Config {
  secret: string;
  baseURL: string;
  clientID: string;
  issuerBaseURL: string;
}
interface IConfig {
  databaseUri: string;
  port: string | number;
  nodeEnv: string;
  auth0: IAuth0Config;
}
const config: IConfig = {
  databaseUri: process.env.DATABASE_URI || "mongodb://localhost:27017/",
  port: process.env.PORT || 3000,
  // jwtSecret: process.env.JWT_SECRET,
  // jwtExpiration: process.env.JWT_EXPIRATION,
  // jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
  // jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  nodeEnv: process.env.NODE_ENV || "development",
  auth0: {
    secret: process.env.AUTH0_SECRET!,
    baseURL: process.env.AUTH0_BASE_URL!,
    clientID: process.env.AUTH0_CLIENT_ID!,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL!,
  },
};

export default config;
