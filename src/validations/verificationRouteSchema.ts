import {Joi} from "celebrate";

import {emailSchema} from "@validations/genericSchemas";

const emailVerificationRequestBodySchema = Joi.object({
	email: emailSchema,
});

export {emailVerificationRequestBodySchema};
