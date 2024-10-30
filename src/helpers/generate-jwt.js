import jwt from 'jsonwebtoken';

export const generarJWT = (id = '', name = '', username = '', email = '', role = '', unidadId = '', report = '') => {

    return new Promise((resolve, reject) => {

        const payload = { id, name, username, email, role, unidadId, report};

        jwt.sign(

            payload,
            process.env.PRIVATE_SECRET_KEY,
            { expiresIn: '8h' },
            (err, token) => {

                if (err) {
                    console.log(err);
                    reject('Could not generate a token');
                } else {
                    resolve(token);
                }
            }
        );
    });
};

export const verifyMicrosoftToken = async (token) => {
    try {
        // Decodifica el token
        const decodedToken = jwt.decode(token, { complete: true });

        // Valida que el token tenga la estructura correcta
        if (!decodedToken || !decodedToken.payload) {
            throw new Error('Invalid token structure');
        }

        // Aquí puedes agregar más validaciones según sea necesario (audience, issuer, etc.)
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.payload.exp < currentTime) {
            throw new Error('Token has expired');
        }

        // Si todas las validaciones pasan, retorna el usuario
        return decodedToken.payload; // O el usuario que necesites
    } catch (error) {
        console.error('Error verifying token:', error);
        throw new Error('Token verification failed');
    }
};