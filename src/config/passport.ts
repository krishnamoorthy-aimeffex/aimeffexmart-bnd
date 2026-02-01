import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { Strategy as FacebookStrategy, Profile as FacebookProfile } from "passport-facebook";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config(); // ✅ load env vars first

// ✅ Validate env variables early (prevents silent crashes)
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google OAuth env variables are missing");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: (err: Error | null, user?: any) => void
    ) => {
      try {
        // ✅ Google always returns at least one email for verified apps
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account has no email"), undefined);
        }

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        // 🔥 Auto-signup
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
          });
        }

        // 🔥 Auto-login
        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
  throw new Error("Facebook OAuth env variables missing");
}

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
    },
    async (_accessToken: string, _refreshToken: string, profile: FacebookProfile, done: any) => {
      try {
        const email = profile.emails?.[0]?.value;

        let user = await User.findOne({
          $or: [{ facebookId: profile.id }, { email }],
        });

        // 🔥 Signup
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            facebookId: profile.id,
          });
        }

        // 🔥 Login
        return done(null, user);
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  )
);

export default passport;
