import * as yup from "yup";

// Yup schema used to validate login form
export const userLoginSchema = yup.object().shape({
  username: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .required()
});

export type UserLoginSchema = yup.InferType<typeof userLoginSchema>;

export const user2FALoginSchema = yup.object().shape({
  code: yup
    .string()
    .required(),
  remember: yup
  	.bool()
});

export type User2FALoginSchema = yup.InferType<typeof user2FALoginSchema>;

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required()
});

export type ForgotPasswordSchema = yup.InferType<typeof forgotPasswordSchema>;

export const resetPasswordSchema = yup.object().shape({
  new_password: yup
    .string()
    .required()
    .min(10),
  new_password2: yup
    .string()
    .required()
    .min(10)
}).test(
    "passwordConfirmation",
    "Passwords don't match",
    obj => obj.new_password === obj.new_password2
  );;

export type ResetPasswordSchema = yup.InferType<typeof resetPasswordSchema>;
