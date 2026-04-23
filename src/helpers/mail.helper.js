import transpoter from "../configs/nodemailor.config.js";

export const sendEmail = (to, subject, content) => {
  transpoter.sendMail(
    {
      to,
      subject,
      text: content,
    },
    (err, info) => {
      console.log("ERRRRR", err);

      if (err) {
        throw new Error("Mail error");
      }

      console.log("INFO", info);
    },
  );
};
