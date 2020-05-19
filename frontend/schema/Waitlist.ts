import * as yup from "yup";

export const waitlistSchema = yup
  .object()
    .shape({
      email: yup
      .string()
      .email()
      .required()
      .label("Email Address"),
    });

export type WaitlistSchema = yup.InferType<typeof waitlistSchema>;