import Joi from "joi";

const userValidator = Joi.object({
    name: Joi.string().min(3).max(12).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(12).required(),
    role: Joi.string().valid("student", "teacher", "admin").default("student")
})

export default userValidator;