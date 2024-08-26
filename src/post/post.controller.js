import { request, response } from 'express';
import Post from './Post.model.js';
import User from '../user/user.model.js';
import cloudinary from '../../config/cloudinary.js';

export const createPost = async (req = request, res = response) => {
    const { title, description } = req.body;
    const { user } = req;

    try {
        let photoUrl = 'None';
        
        if (req.file) {
            const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                folder: 'post_photos',
            });
            photoUrl = uploadResponse.secure_url;
        }

        const post = new Post({ title, description, photo: photoUrl, user: user.id });
        await post.save();

        const userData = await User.findById(user.id).select('name');
        res.status(201).json({ post, userName: userData.name });
    } catch (e) {
        res.status(500).json({ msg: 'Contact the administrator' });
    }
};

export const listPost = async  (req = request, res = response) =>{
    try{
        const posts = await Post.find({ status: true }).populate('user', 'name'); res.status(200).json(posts);
    }catch(e){
        res.status(500).json({ msg: "Porfavor contacta al administrador" });
    }
};


export const updatePost = async (req = request, res = response) => {
    const { id } = req.params;
    const { title, description } = req.body;
    
    try {
        let updateData = { title, description };

        if (req.file) {
            const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                folder: 'post_photos',
            });
            updateData.photo = uploadResponse.secure_url;
        }

        const post = await Post.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ post });
    } catch (e) {
        res.status(500).json({ msg: 'Contact the administrator' });
    }
};

export const deletePost = async (req = request, res = response) => {
    const { id } = req.params;
    
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        post.status = false;
        await post.save();
        res.status(200).json({ msg: 'Post deleted' });
    } catch (e) {
        res.status(500).json({ msg: 'Contact the administrator' });
    }
};