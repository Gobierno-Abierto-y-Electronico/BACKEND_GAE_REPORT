import Note from './note.model.js';
import User from '../user/user.model.js';
import { request, response } from 'express';

export const createNote = async (req, res) => {

    const { title, notedUsername, body } = req.body;
    const { id: creatorUserId } = req.user;

    try {

        const notedUser = await User.findOne({ username: notedUsername });

        if (!notedUser) {

            return res.status(404).json({
                msg: 'Noted user not found'
            });
        }

        const newNote = new Note({

            creatorUserId,
            title,
            notedUserId: notedUser._id,
            body
        });

        await newNote.save();

        res.status(201).json(newNote);
    } catch (e) {

        res.status(500).json({
            msg: 'Server error'
        });
    }
};


export const getAllNotes = async (req, res) => {

    try {

        const notes = await Note.find().populate('creatorUserId', 'name').populate('notedUserId', 'name');
        res.json(notes);
    } catch (e) {

        console.log(e);
        res.status(500).json({
            msg: 'Server error'
        });
    }
};


export const getNotesByCreator = async (req , res) => {

    const { id } = req.user;

    try {

        const notes = await Note.find({ creatorUserId: id }).populate('creatorUserId', 'name').populate('notedUserId', 'name');
        res.json(notes);
    } catch (e) {

        res.status(500).json({
            msg: 'Server error'
        });
    }
};


export const updateNote = async (req = request, res = response) => {

    const { id } = req.params;
    const { title, body } = req.body;

    try {

        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({
                msg: 'Note not found'
            });
        }

        if (title) note.title = title;
        if (body) note.body = body;

        await note.save();

        res.json(note);

    } catch (e) {
        
        console.log(e);
        res.status(500).json({
            msg: 'Server error'
        });
    }
};