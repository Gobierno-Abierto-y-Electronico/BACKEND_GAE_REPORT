export const validateJWT = async (req = request, res = response, next) => {
    let token = req.body.token || req.query.token || req.headers['authorization'];

    console.log("Token recibido:", token); // Verifica si el token se recibe

    if (!token) {
        console.log("Error: No se encontró el token en la solicitud");
        return res.status(401).json({
            msg: 'There is no token in the request'
        });
    }

    try {
        token = token.replace(/^Bearer\s+/, '');
        console.log("Token después de quitar 'Bearer':", token);

        const decoded = jwt.verify(token, process.env.PRIVATE_SECRET_KEY);
        console.log("Token decodificado correctamente:", decoded);

        req.user = decoded;
        next();

    } catch (e) {
        console.log("Error al verificar el token:", e.message); // Imprime el error específico de la verificación
        res.status(401).json({
            msg: "This token is not valid"
        });
    }
};
