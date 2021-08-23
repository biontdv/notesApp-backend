const InvariantError = require('../../exceptions/InvariantError')
const userSchema = require('./schema')

const userValidator={
    Uservalidate:(payload) => {
      const result= userSchema.validate(payload)
      if(result.error){
        throw new InvariantError(result.error.message)
      }
    }
}

module.exports = userValidator