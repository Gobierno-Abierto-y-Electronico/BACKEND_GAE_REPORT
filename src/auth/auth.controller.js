/* import passport from 'passport';
import { BearerStrategy } from 'passport-azure-ad';

const options = {
  identityMetadata: `https://login.microsoftonline.com/4e5a94e9-e691-484d-a509-0f12ed40cce5/v2.0/.well-known/openid-configuration`,
  clientID: "TU_CLIENT_ID",
  issuer: `https://login.microsoftonline.com/4e5a94e9-e691-484d-a509-0f12ed40cce5/v2.0`,
  loggingLevel: "info",
  passReqToCallback: false,
};

passport.use(
  new BearerStrategy(options, (token, done) => {
    return done(null, token);
  })
);

export const authenticate = passport.authenticate("oauth-bearer", { session: false });

passport.use(
  new BearerStrategy(options, (token, done) => {
    console.log("Token recibido por BearerStrategy:", token);

    if (!token) {
      console.log("Error: No se proporcionó un token válido.");
      return done(null, false, { message: "Token not provided" });
    }

    // Si el token es válido
    return done(null, token);
  })
);

 */