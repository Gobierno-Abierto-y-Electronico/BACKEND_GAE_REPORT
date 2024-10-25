import passport from 'passport';
import { BearerStrategy } from 'passport-azure-ad';

const options = {
  identityMetadata: `https://login.microsoftonline.com/TU_TENANT_ID/v2.0/.well-known/openid-configuration`,
  clientID: "TU_CLIENT_ID",
  issuer: `https://login.microsoftonline.com/TU_TENANT_ID/v2.0`,
  loggingLevel: "info",
  passReqToCallback: false,
};

passport.use(
  new BearerStrategy(options, (token, done) => {
    // Aquí puedes acceder a la información del usuario en el token
    // por ejemplo, token.sub (ID del usuario) o token.upn (correo)
    return done(null, token); // Puedes devolver el token o el objeto del usuario
  })
);

// Exporta la función de autenticación para su uso en las rutas
export const authenticate = passport.authenticate("oauth-bearer", { session: false });
