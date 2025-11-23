import {Joi} from "celebrate";

import config from "@config";

import {
	emailSchema,
	firstNameSchema,
	lastNameSchema,
} from "@validations/genericSchemas";

const passwordSchema = Joi.string().required();

const signupBodySchema = Joi.object({
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	email: emailSchema,
	password: passwordSchema,
});

const signinBodySchema = Joi.object({
	email: emailSchema,
	password: passwordSchema,
});

const renewAccessTokenBodySchema = Joi.object({
	refreshToken: Joi.string().required(),
});

const resetPasswordRequestSchema = Joi.object({
	email: emailSchema,
});

const resetPasswordBodySchema = Joi.object({
	email: emailSchema,
	otp: Joi.string().length(config.resetPasswordConfig.otpLength).required(),
	newPassword: passwordSchema,
});

export {
	signupBodySchema,
	signinBodySchema,
	renewAccessTokenBodySchema,
	resetPasswordRequestSchema,
	resetPasswordBodySchema,
};
