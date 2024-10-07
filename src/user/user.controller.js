import { request, response } from 'express';
import User from './user.model.js';

export const getUsers = async (req = request, res = response) => {
    const { start, end } = req.query;
    const query = { status: true };

    try {
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(start))
                .limit(Number(end))
        ]);

        res.status(200).json({
            total,
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};


export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {

        const userData = await User.findById(id).select('-password');
        res.status(200).json({ user: userData });
    } catch (e) {

        res.status(500).json({ msg: 'Contact the administrator' });
    }
};


export const updateUser = async (req, res) => {
    const { id } = req;
    const { updateData } = req.body;  

    console.log(id, "this id backend", updateData)
    try {
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        res.status(200).json({ user: updatedUser });
        console.log("usuario actualizado");
        console.log(updatedUser, "data del usaer backend")
    } catch (e) {
        console.log(e, "this is the error")
    }
};


export const deleteUser = async (req, res) => {

    const { user } = req;
    
    try {

        const userData = await User.findById(user.id);

        if (!userData || !userData.status) {
            return res.status(400).json({ msg: 'User already deleted' });
        }

        userData.status = false;
        await userData.save();
        res.status(200).json({ msg: 'User account deactivated' });
    } catch (e) {
        
        res.status(500).json({ msg: 'Contact the administrator' });
    }
};
