import Joi from 'joi';

const schema = Joi.object({
    nickname : Joi.string().pattern(new RegExp('^[a-zA-Z가-힣0-9]{4,16}$')).required().messages({
        'string.pattern.base' : "닉네임은 한글, 영문, 숫자 조합 4~16자 입니다.",
        'string.empty' : "닉네임을 입력해 주세요",
    }),
    email: Joi.string().email().required().messages({
        'string.pattern.base' : "올바른 이메일 양식에 맞춰 입력해주세요",
        'string.empty': "이메일을 입력해 주세요.",
    }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+]{6,20}$')).min(6).max(20).required().messages({
        'string.pattern.base' : "비밀번호는 영문, 숫자, 특수기호를 포함해 6~20자 입니다.",
        'string.empty': "비밀번호를 입력해 주세요.",


    }),
});

export default schema;