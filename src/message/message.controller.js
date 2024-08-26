import { response, request } from "express";
import Message from "./message.model.js";
import moment from "moment";

const limiteTiempo = 2;

export const postMessage = async (req, res) => {
    const { receptor, emisor, content, chatId } = req.body;
    const message = new Message({ receptor, emisor, content, chatId });

    try {
        await message.save();

        res.status(201).json({
            message
        });

    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getMessages = async (req = request, res = response) => {
    const { start, end } = req.query;
    const query = { isDeleted: false };

    try {
        const [total, messages] = await Promise.all([
            Message.countDocuments(query),
            Message.find(query)
                .skip(Number(start))
                .limit(Number(end))
                .populate('receptor emisor')
        ]);

        res.status(200).json({
            total,
            messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getMessageById = async (req, res) => {
    const { id } = req.params;

    try {
        const message = await Message.findOne({ _id: id, isDeleted: false })
            .populate('receptor emisor');

        res.status(200).json({
            message
        });
    } catch (error) {
        console.error('Error fetching message by ID:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const putMessage = async (req, res = response) => {
    const { id } = req.params;
    const { ...resto } = req.body;

    try {
        const message = await Message.findById(id);

        if (!message) {
            return res.status(404).json({
                error: 'Message not found'
            });
        }

        const now = moment();
        const sendAt = moment(message.SendAt);
        const diffMinutes = now.diff(sendAt, 'minutes');

        if (diffMinutes > limiteTiempo) {
            return res.status(403).json({
                error: 'Message can no longer be edited'
            });
        }

        const updatedMessage = await Message.findByIdAndUpdate(id, resto, { new: true })
            .populate('receptor emisor');

        res.status(200).json({
            msg: 'Updated Message!!',
            message: updatedMessage
        });
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const deleteMessage = async (req, res) => {
    const { id } = req.params;

    try {
        const message = await Message.findById(id);

        if (!message) {
            return res.status(404).json({
                error: 'Message not found'
            });
        }

        const now = moment();
        const sendAt = moment(message.SendAt);
        const diffMinutes = now.diff(sendAt, 'minutes');

        if (diffMinutes > limiteTiempo) {
            return res.status(403).json({
                error: 'Message can no longer be deleted'
            });
        }

        message.isDeleted = true;
        await message.save();

        res.status(200).json({
            msg: 'Message successfully removed',
            message,
        });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};
