'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import { dbConnection } from './mongo.js';
import chatRoutes from '../src/chat/chat.routes.js';
import messageRoutes from '../src/message/message.routes.js';
import postRoutes from '../src/post/post.routes.js';
import userRoutes from '../src/user/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import forumRoute from '../src/forum/forum.router.js';
import reportRoutes from '../src/report/report.routes.js';
import personalRoutes from '../src/personal/personal.routes.js';
import unidadRoutes from '../src/unidad/unidad.routes.js';
import { authenticate } from '../src/middlewares/authMiddleware.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.userPath = '/GAE/v1/user';
        this.authPath = '/GAE/v1/auth'; 
        this.chatPath = '/GAE/v1/chat';
        this.messagePath = '/GAE/v1/message';
        this.postPath = '/GAE/v1/post';
        this.forumPath = '/GAE/v1/forum';
        this.personalPath = '/GAE/v1/personal';
        this.unidadPath = '/GAE/v1/unidad';
        this.reportPath = '/GAE/v1/report';

        this.middlewares();
        this.conectarDB();
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors({
            origin: true,
            credentials: true,
        }));
    
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
        this.app.use(passport.initialize());

        this.app.use((req, res, next) => {
            console.log(`${req.method} ${req.originalUrl}`);
            next();
        });
    }

    routes() {
        this.app.use(this.userPath, authenticate, userRoutes);
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.chatPath, authenticate, chatRoutes);
        this.app.use(this.messagePath, authenticate, messageRoutes);
        this.app.use(this.forumPath, authenticate, forumRoute);
        this.app.use(this.postPath, authenticate, postRoutes);
        this.app.use(this.personalPath, authenticate, personalRoutes);
        this.app.use(this.unidadPath, authenticate, unidadRoutes);
        this.app.use(this.reportPath, reportRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port', this.port);
        });
    }
}

export default Server;
