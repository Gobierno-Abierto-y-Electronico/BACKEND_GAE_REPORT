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