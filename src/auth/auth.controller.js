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
    return done(null, token);
  })
);

export const authenticate = passport.authenticate("oauth-bearer", { session: false });
