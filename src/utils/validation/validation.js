import Joi from 'joi';

const schema = Joi.object({
    email: Joi.string().email().required(),
});

export default schema;