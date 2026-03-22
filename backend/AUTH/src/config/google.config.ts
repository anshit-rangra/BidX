import { Strategy } from 'passport-google-oauth20'
import type { VerifyCallback } from 'passport-google-oauth20';
import type { Profile } from 'passport-google-oauth20';
import { config } from 'dotenv'

config(); 

interface GoogleStrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
}



export default function googleStrategy() {
    return new Strategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: '/api/auth/google/callback',
    } as GoogleStrategyOptions,
    (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        return done(null, profile);
    }
)
}