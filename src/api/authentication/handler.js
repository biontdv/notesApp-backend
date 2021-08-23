const ClientError = require('../../exceptions/ClientError')

class AuthenticationHandler{
    constructor(authService,userService,tokenManager,validator) {
      this._authService = authService;
      this._userService = userService;
      this._tokenManager = tokenManager;
      this._validator = validator;
      this.postAuthHandler=this.postAuthHandler.bind(this);
      this.putAuthHandler=this.putAuthHandler.bind(this);
      this.deleteAuthHandler=this.deleteAuthHandler.bind(this);
    }

    async postAuthHandler(request,h) {
      try {
        this._validator.authPostValidate(request.payload)
        const id= await this._userService.verifyUserCredentials(request.payload)
        const accessToken= this._tokenManager.generateAccessToken({id});
        const refreshToken= this._tokenManager.generateRefreshToken({id})
        await this._authService.addRefreshToken(refreshToken)

        return h.response({
          status: 'success',
          message: 'Authentication berhasil ditambahkan',
          data: {
              accessToken,
              refreshToken
          }
        }).code(201)
      } catch (error) {
        if(error instanceof ClientError){
          return h.response({
            status: 'fail',
            message: error.message
        }).code(error.statusCode)
        }
        console.log(error)
        return h.response({
          status: 'error',
          message: error.message
        }).code(500)
      }
    }

    async putAuthHandler(request, h) {
      try {
        this._validator.authUpdatePayloadSchema(request.payload)
        const { refreshToken }= request.payload
        await this._authService.verifyRefreshToken(refreshToken)
        const { id }= this._tokenManager.verifyRefreshToken(refreshToken)   
        const accessToken= this._tokenManager.generateAccessToken(id)
        return h.response({
          status: 'success',
          message: 'Access Token berhasil diperbarui',
          data: {
              accessToken
          }
        })
      } catch (error) {
        if(error instanceof ClientError){
          return h.response({
            status: 'fail',
            message: error.message
        }).code(error.statusCode)
        }
        console.log(error)
        return h.response({
          status: 'error',
          message: error.message
        }).code(500) 
      }
    }

    async deleteAuthHandler(request, h) {
      try {
        this._validator.authDeletePayloadSchema(request.payload)
        await this._authService.verifyRefreshToken(request.payload)
        await this._authService.deleteRefreshToken(request.payload)
        return h.response({
          status: 'success',
          message: 'Refresh token berhasil dihapus'
        })
      } catch (error) {
        if(error instanceof ClientError){
          return h.response({
            status: 'fail',
            message: error.message
        }).code(error.statusCode)
        }
        console.log(error)
        return h.response({
          status: 'error',
          message: error.message
        }).code(500) 
      }
    }
}

module.exports = AuthenticationHandler