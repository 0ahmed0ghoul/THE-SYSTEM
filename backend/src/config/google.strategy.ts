import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "../config/db.js";
import { findUserByEmail } from "../services/auth.service.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("No email from Google"), false);
        }

        // 1. Try find by email
        let user = await findUserByEmail(email);

        // 2. If exists → link Google account
        if (user) {
          await db.execute(
            `
            UPDATE users 
            SET google_id = ?, provider = 'google'
            WHERE id = ?
            `,
            [googleId, user.id]
          );

          user.google_id = googleId;
          user.provider = "google";
        }

        // 3. If not exists → create full user
        if (!user) {
          const [result] = await db.execute<any>(
            `
            INSERT INTO users 
              (name, email, password_hash, google_id, provider, is_profile_complete, is_verified)
            VALUES (?, ?, NULL, ?, 'google', 0, 1)
            `,
            [name, email, googleId]
          );

          const [rows] = await db.execute<any>(
            `SELECT * FROM users WHERE id = ?`,
            [result.insertId]
          );

          user = rows[0];
        }

        // 4. IMPORTANT: return DB user ONLY
        return done(null, {
          id: user?.id,
          email: user?.email,
          name: user?.name,
          role: user?.role || "user",
        });
      } catch (err) {
        return done(err as Error, false);
      }
    }
  )
);