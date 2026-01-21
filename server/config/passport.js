const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        done(null, user);
    } catch (err) {
        console.error("Deserialize Error for ID " + id, err);
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists
            let user = await prisma.user.findUnique({
                where: { googleId: profile.id }
            });

            if (user) {
                return done(null, user);
            }

            // Check if email exists to link or just create new
            const existingEmailUser = await prisma.user.findUnique({
                where: { email: profile.emails[0].value }
            });

            if (existingEmailUser) {
                // Update with googleId if missing? Or just return error?
                // For now, let's link them if we were doing hybrid auth, 
                // but for simplicity, we'll just update or return it.
                // Actually, best practice: if email matches, link account.
                user = await prisma.user.update({
                    where: { email: profile.emails[0].value },
                    data: {
                        googleId: profile.id,
                        avatar: profile.photos[0]?.value || existingEmailUser.avatar
                    }
                });
                return done(null, user);
            }

            // Create new user
            user = await prisma.user.create({
                data: {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0]?.value,
                    isVerified: true
                }
            });

            done(null, user);
        } catch (err) {
            console.error("Passport Error:", err);
            done(err, null);
        }
    }));
