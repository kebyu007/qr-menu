import { config } from "dotenv";

config({ quiet: true });

export default {
  accessKey: process.env.ACCESS_T_SC,
  accessEx: process.env.ACCESS_T_EX ? Number(process.env.ACCESS_T_EX) : 300,
  refreshKey: process.env.REFRESH_T_SC,
  refreshEx: process.env.REFRESH_T_EX,
};
