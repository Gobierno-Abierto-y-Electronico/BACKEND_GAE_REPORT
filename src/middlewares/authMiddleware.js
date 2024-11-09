import passport from 'passport';
import { BearerStrategy } from 'passport-azure-ad';

const options = {
  identityMetadata: `https://login.microsoftonline.com/a00e95d9-ed09-478e-9f3a-7aa025deb516/v2.0/.well-known/openid-configuration`,
  clientID: "7d105d0d-94ca-4645-873d-4bd5edf190bb",
  issuer: `https://login.microsoftonline.com/a00e95d9-ed09-478e-9f3a-7aa025deb516/v2.0`,
  loggingLevel: "info",
  passReqToCallback: false,
};

passport.use(
  new BearerStrategy(options, (token, done) => {
    if (!token) {
      return done(null, false, { message: "Token not provided" });
    }

    // Decode the token to verify its claims
    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken) {
      return done(null, false, { message: "Invalid token structure" });
    }

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    // Validate expiration
    if (decodedToken.payload.exp < currentTime) {
      return done(null, false, { message: "Token has expired" });
    }

    // Validate audience
    if (decodedToken.payload.aud !== options.clientID) {
      return done(null, false, { message: "Invalid audience" });
    }

    // Validate issuer
    if (decodedToken.payload.iss !== options.issuer) {
      return done(null, false, { message: "Invalid issuer" });
    }

    // If all checks pass, return the token
    return done(null, token);
  })
);

export const authenticate = passport.authenticate("oauth-bearer", { session: false });
