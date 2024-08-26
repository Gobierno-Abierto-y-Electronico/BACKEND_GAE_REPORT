'use strict'

import mongoose from 'mongoose';

export const dbConnection = async () => {

    try {

        mongoose.connection.on('error', () => {

            console.log('MongoDB | Could not be connect to MongoDB')
            mongoose.disconnect();
        })
        mongoose.connection.on('connecting', () => {

            console.log('MongoDB | Try connecting');
        })
        mongoose.connection.on('connected', () => {

            console.log('MongoDB | Connected to MongoDB');
        })
        mongoose.connection.on('open', () => {

            console.log('MongoDB | Connected to database')
        })
        mongoose.connection.on('reconnected', () => {

            console.log('MongoDB | Reconnected to MongoDB')
        })
        mongoose.connection.on('disconnected', () => {

            console.log('MongoDB | Disconnected')
        })

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 8000,
            maxPoolSize: 100
        });
    } catch (e) {
        console.log(process.env.URI_MONGO),
        console.log('Database connection failed', e)
    }
}