const {PostPayloadSchema,UpdatePayloadSchema,DeletePayloadSchema} =require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const authValidator={
    authPostValidate:(payload)=>{
      const validationResult=PostPayloadSchema.validate(payload)
      if(validationResult.error){
          throw new InvariantError(validationResult.error.message)
      }
    },

    authUpdatePayloadSchema:(payload)=>{
        const validationResult=UpdatePayloadSchema.validate(payload)
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    },

    authDeletePayloadSchema:(payload)=>{
        const validationResult=DeletePayloadSchema.validate(payload)
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    }

}

module.exports=authValidator