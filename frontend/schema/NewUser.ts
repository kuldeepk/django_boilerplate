import * as yup from "yup";

// Yup schema used to validate signup form
export const newUserSchema = yup
  .object()
  .shape({
    first_name: yup
      .string()
      .required()
      .label("First Name"),
    last_name: yup
      .string()
      .required()
      .label("Last Name"),
    email: yup
      .string()
      .email()
      .required()
      .label("Email Address"),
    password1: yup
      .string()
      .required()
      .min(8)
      .label("Password"),
    password2: yup
      .string()
      .required()
      .min(8)
      .label("Password Confirmation"),
    invite: yup
      .string()
      .required()
      .nullable()
      .label("Invite code"),
  })
  .test(
    "passwordConfirmation",
    "Passwords don't match",
    obj => obj.password1 === obj.password2
  );

export type NewUserSchema = yup.InferType<typeof newUserSchema>;

export const newInvitedUserSchema = yup
  .object()
  .shape({
    first_name: yup
      .string()
      .required()
      .label("First Name"),
    last_name: yup
      .string()
      .required()
      .label("Last Name"),
    email: yup
      .string()
      .email()
      .required()
      .label("Email Address"),
    password1: yup
      .string()
      .required()
      .min(10)
      .label("Password"),
    password2: yup
      .string()
      .required()
      .min(10)
      .label("Password Confirmation"),
    uid: yup
      .string()
      .required()
      .nullable(),
    token: yup
      .string()
      .required()
      .nullable()
  })
  .test(
    "passwordConfirmation",
    "Passwords don't match",
    obj => obj.password1 === obj.password2
  );

export type NewInvitedUserSchema = yup.InferType<typeof newInvitedUserSchema>;
