'use strict'

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import chatRoutes from '../src/chat/chat.routes.js';
import messageRoutes from '../src/message/message.routes.js';
import postRoutes from '../src/post/post.routes.js';
import appointmentRoutes from '../src/appointment/appointment.routes.js';
import userRoutes from '../src/user/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import forumRoute from '../src/forum/forum.router.js';
import noteRoutes from '../src/note/note.routes.js';
import personalRoutes from '../src/personal/personal.routes.js';
import unidadRoutes from '../src/unidad/unidad.routes.js';

class Server{

    constructor(){

        this.app = express()
        this.port = process.env.PORT

        this.userPath = '/GAE/v1/user'
        this.authPath = '/GAE/v1/auth'
        this.chatPath = '/GAE/v1/chat';
        this.messagePath = '/GAE/v1/message'
        this.postPath = '/GAE/v1/post';
        this.forumPath = '/GAE/v1/forum'
        this.appointmentPath = '/GAE/v1/appointment';
        this.notePath = '/GAE/v1/note';
        this.personalPath = '/GAE/v1/personal';
        this.unidadPath = '/GAE/v1/unidad'
        
        this.middlewares()
        this.conectarDB()
        this.routes()
    }

    async conectarDB(){

        await dbConnection()
    }

    middlewares(){

        this.app.use(express.urlencoded({extended: false}))
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(helmet())
        this.app.use(morgan('dev'))
    }

    routes(){

        this.app.use(this.userPath, userRoutes);
        this.app.use(this.authPath, authRoutes)
        this.app.use(this.chatPath, chatRoutes);
        this.app.use(this.messagePath, messageRoutes);
        this.app.use(this.appointmentPath, appointmentRoutes);
        this.app.use(this.forumPath,forumRoute);
        this.app.use(this.postPath, postRoutes);
        this.app.use(this.notePath, noteRoutes);
        this.app.use(this.personalPath, personalRoutes);
        this.app.use(this.unidadPath, unidadRoutes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port)
        })
    }
}

export default Server