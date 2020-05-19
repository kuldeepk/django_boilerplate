import * as yup from "yup";

export const waitlistSchema = yup
  .object()
    .shape({
      email: yup
      .string()
      .email()
      .required()
      .label("Email address"),
    });

export type WaitlistSchema = yup.InferType<typeof waitlistSchema>;


export const waitlistShareSchema = yup
  .object()
    .shape({
      emails: yup.array()
      	.required()
      	.label("Email addresses")
	    .transform(function(value, originalValue) {
	      if (this.isType(value) && value !== null) {
	        return value;
	      }
	      return originalValue ? originalValue.split(/[\s,]+/) : [];
	    })
	    .of(yup.string().email(({ value }) => `${value} is not a valid email`)),
	  	from_email: yup
	      .string()
	      .email()
	      .required()
    });

export type WaitlistShareSchema = yup.InferType<typeof waitlistShareSchema>;