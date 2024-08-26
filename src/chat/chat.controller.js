import { response, request } from "express";
import Chat from "./chat.model.js";
import User from "../user/user.model.js"

export const postChat = async (req, res) => {
    const { owner, receptor } = req.body;
    const chat = new Chat({ owner, receptor });

    try {
        await chat.save();
        const ownerUser = await User.findById(owner);
        const receptorUser = await User.findById(receptor);

        res.status(201).json({
            chat,
            ownerUser: { username: ownerUser.username, secret: ownerUser.secret },
            receptorUser: { username: receptorUser.username, secret: receptorUser.secret }
        });

    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getChats = async (req = request, res = response) => {
    const { start, end } = req.query;
    const query = { status: true };

    try {
        const [total, chats] = await Promise.all([
            Chat.countDocuments(query),
            Chat.find(query)
                .skip(Number(start))
                .limit(Number(end))
                .populate('owner receptor')
        ]);

        res.status(200).json({
            total,
            chats
        });
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getChatById = async (req, res) => {
    const { id } = req.params;

    try {
        const chat = await Chat.findOne({ _id: id })
            .populate('owner receptor');

        res.status(200).json({
            chat
        });
    } catch (error) {
        console.error('Error fetching chat by ID:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const putChat = async (req, res = response) => {
    const { id } = req.params;
    const { ...resto } = req.body;

    try {
        const updatedChat = await Chat.findByIdAndUpdate(id, resto, { new: true })
            .populate('owner receptor');

        res.status(200).json({
            msg: 'Updated Chat!!',
            chat: updatedChat
        });
    } catch (error) {
        console.error('Error updating chat:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const deleteChat = async (req, res) => {
    const { id } = req.params;

    try {
        const chat = await Chat.findByIdAndUpdate(id, { status: false })
            .populate('owner receptor');

        res.status(200).json({
            msg: 'Chat successfully removed',
            chat,
        });
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};
