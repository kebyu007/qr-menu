import { config } from "dotenv";
import { BlackholedSignatureError, ExpiredSignatureError } from "signed";
import { ConflictException } from "../exceptions/conflict.exception.js";

config({ quiet: true });

const BASE_URL = process.env.BASE_URL;

export const VerifySignatureMiddleware = (req, res, next) => {
  try {
    const fullUrl = `${BASE_URL}/auth${req.url}`;

    signature.verify(fullUrl);
    next();
  } catch (error) {
    if (error instanceof BlackholedSignatureError) {
      throw new ConflictException("Signature is not valid");
    }
    if (error instanceof ExpiredSignatureError) {
      throw new ConflictException("Signature expired");
    } 
    next(error);
  }
};
