import passport from "passport";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URL } from "./config";
const GoogleStrategy = require('passport-google-oauth2').Strategy;
import { UserSchema } from "../models/dbSchemas/userSchema";

export const setupGoogleAuth = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID!,
                clientSecret: GOOGLE_CLIENT_SECRET!,
                callbackURL: REDIRECT_URL,
            },
            async (accessToken: string, refreshToken: string, profile: any, done: any) => {
                try {
                    const existingUser = await UserSchema.findOne({ email: profile.email });

                    if (existingUser) {
                        return done(null, existingUser);
                    }

                    const newUser = await UserSchema.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails?.[0]?.value,
                    });

                    return done(null, newUser);
                } catch (error) {
                    done(error, undefined);
                }
            }
        )
    );

    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await UserSchema.findById(id);
        done(null, user);
    });
}