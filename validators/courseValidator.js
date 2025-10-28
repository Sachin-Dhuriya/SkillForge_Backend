import Joi from "joi";

const courseValidator = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(5).required(),
    price: Joi.number().min(0).positive().required(),
    category: Joi.string().min(3).required()
})

export default courseValidator;