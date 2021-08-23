const ClientError = require('../../exceptions/ClientError')
const NotFoundError = require('../../exceptions/NotFoundError')

class UserHandler{
    constructor(service,validator) {
      this._validator = validator
      this._service = service
      this.postUserHandler= this.postUserHandler.bind(this)
      this.getUserByIdHandler= this.getUserByIdHandler.bind(this)
    }

    async postUserHandler(request,h){
      try {
        this._validator.Uservalidate(request.payload)
        const userId= await this._service.addUser(request.payload)
        return h.response({
          status: 'success',
          message: 'User berhasil ditambahkan',
          data:{
            userId
          }
        }).code(201)
      } catch (error) {
        if(error instanceof ClientError){
          return h.response({
            status:'fail',
            message:error.message
          }).code(error.statusCode)
        }
        console.log(error);
        return h.response({
          status:'error',
          message:'Maaf, terjadi kegagalan pada server kami.'
        }).code(500)
      }
    }

    async getUserByIdHandler(request, h){
      try {
        const { id }= request.params;
        const user= await this._service.getUserById(id)
        return h.response({
          status: 'success',
          data: {
            user
          }
        })
      } catch (error) {
        if(error instanceof NotFoundError){
          return h.response({
            status:'fail',
            message:error.message
          }).code(error.statusCode)
        }
        console.log(error);
        return h.response({
          status:'error',
          message:'Maaf, terjadi kegagalan pada server kami.'
        }).code(500)  
      }
    }
}

module.exports = UserHandler;