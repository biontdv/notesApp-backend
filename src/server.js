//* import package dotenv dan menjalankan konfigurasi nya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt')
const notes = require('./api/notes');
const NotesService = require('./service/postgres/notesService');
const NotesValidator = require('./validator/notes');
const users = require('./api/users')
const UserService = require('./service/postgres/UsersService')
const UserValidator = require('./validator/users')
const authentications= require('./api/authentication')
const AuthenticationsService= require('./service/postgres/AuthService')

const tokenManager= require('./tokenize/TokenManager')
const AuthenticationsValidator= require('./validator/authentication')

const collaborations= require('./api/collaborations')
const CollaborationsService = require('./service/postgres/CollaborationsService')
const CollaborationValidator= require('./validator/collaborations')

const init = async () => {
  const usersService = new UserService();
  const collaborationsService= new CollaborationsService();
  const notesService = new NotesService(collaborationsService);
  const authenticationsService= new AuthenticationsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin : Jwt
    },
  ])

  server.auth.strategy('notesapp_jwt','jwt',{
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts)=>({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  await server.register([
  
  {
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    }
  },
  {
    plugin: users,
    options: {
      service: usersService,
      validator: UserValidator,
    }
  },
  {
    plugin:authentications,
    options:{
      authenticationsService,
      usersService,
      tokenManager,
      validator: AuthenticationsValidator
    }
  },
  {
    plugin: collaborations,
    options:{
      collaborationsService,
      notesService,
      validator: CollaborationValidator
    }
  }
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
