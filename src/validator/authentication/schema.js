const Joi =require('joi')

const PostPayloadSchema= Joi.object({
  username: Joi.required(),
  password: Joi.required()
})

const UpdatePayloadSchema= Joi.object({
    refreshToken: Joi.required()
})

const DeletePayloadSchema= Joi.object({
    refreshToken: Joi.required()
})

module.exports = {PostPayloadSchema,UpdatePayloadSchema,DeletePayloadSchema}