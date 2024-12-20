import Joi from 'joi';

const schema = Joi.object({
    nickname : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,16}$')).required(),
    email: Joi.string().email().required(),
});

export default schema;