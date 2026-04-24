import { config } from "dotenv";
import { BlackholedSignatureError, ExpiredSignatureError } from "signed";
import { ConflictException } from "../exceptions/conflict.exception.js";
import { signature } from "../configs/signature.config.js";

config({ quiet: true });

const BASE_URL = process.env.BASE_URL;

export const VerifySignatureMiddleware = (req, res, next) => {
  try {
    const fullUrl = `${BASE_URL}${req.url}`;
    signature.verify(fullUrl);
    next();
  } catch (error) {
    if (error instanceof BlackholedSignatureError) {
      return next(new ConflictException("Signature is not valid"));
    }
    if (error instanceof ExpiredSignatureError) {
      return next(new ConflictException("Signature expired"));
    }
    next(error);
  }
};
