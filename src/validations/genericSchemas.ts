import {Joi} from "celebrate";

const uuidv4Schema = Joi.string().uuid().required();
const emailSchema = Joi.string().email().required();
const firstNameSchema = Joi.string().required();
const lastNameSchema = Joi.string().required();

export {uuidv4Schema, emailSchema, firstNameSchema, lastNameSchema};
