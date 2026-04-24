import { config } from "dotenv";
import signed from "signed";

config({ quiet: true });

export const signature = signed.default({
  secret: process.env.SIGNATURE_KEY,
});

