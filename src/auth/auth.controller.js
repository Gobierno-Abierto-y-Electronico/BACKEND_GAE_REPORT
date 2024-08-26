import { response } from 'express';
import bcryptjs from 'bcryptjs';
import User from '../user/user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js';
 
export const registerUser = async (req, res = response) => {
 
    const { name, username, email, password, description, unidadId} = req.body;
 
    try {

        const user = new User({
 
            name,
            username,
            email,
            password,
            description,
            unidadId
        });
 
        const salt = bcryptjs.genSaltSync();
 
        user.password = bcryptjs.hashSync(password, salt);
 
        await user.save();
 
        res.status(200).json({
            user,
        });
    } catch (error) {
 
        res.status(500).json({
            msg: 'Error registrando usuario',
            error,
        });
    }
};
 
export const login = async (req, res = response) => {
 
    const { email, password } = req.body;
 
    try {
 
        const user = await User.findOne({ email });
 
        if (!user) {
            return res.status(400).json({
                msg: 'Incorrect credentials',
            });
        }
 
        if (!user.status) {
            return res.status(400).json({
                msg: 'This account is not registered',
            });
        }
 
        const validPassword = bcryptjs.compareSync(password, user.password);
 
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Incorrect password',
            });
        }
 
        console.log(user.unidadId, 'Codigo al login')
        const token = await generarJWT(user.id, user.name, user.username, user.email, user.role, user.unidadId, user.report);
 
        res.status(200).json({
            msg: 'Access granted',
            user: {
                username: user.username,
            },
            token,
        });
    } catch (error) {
 
        res.status(500).json({
            msg: 'Contact the administrator',
        });
    }
};