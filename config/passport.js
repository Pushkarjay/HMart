const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const bcrypt = require('bcryptjs');
const { pool } = require('./db'); // Make sure this path is correct
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/appError');

// Local Strategy (email/password)
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    async (email, password, done) => {
      try {
        // 1) Find user by email
        const { rows } = await pool.query(
          'SELECT id, email, password, name, avatar FROM users WHERE email = $1', 
          [email.toLowerCase().trim()] // Normalize email input
        );
        
        if (!rows.length) {
          return done(new AppError('Incorrect email or password', 401), false);
        }

        const user = rows[0];

        // 2) Check password
        if (!user.password || !(await bcrypt.compare(password, user.password))) {
          return done(new AppError('Incorrect email or password', 401), false);
        }

        // 3) Remove sensitive data
        const userWithoutPassword = {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar
        };

        // 4) Generate JWT token
        userWithoutPassword.token = generateToken(user.id);

        return done(null, userWithoutPassword);
      } catch (err) {
        return done(new AppError('Authentication failed', 500));
      }
    }
  )
);

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    req => req.cookies?.jwt // Fallback to cookie if needed
  ]),
  secretOrKey: process.env.JWT_SECRET,
  ignoreExpiration: false
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const { rows } = await pool.query(
        'SELECT id, email, name, avatar FROM users WHERE id = $1',
        [payload.id]
      );

      if (!rows.length) {
        return done(null, false, { message: 'User no longer exists' });
      }

      return done(null, rows[0]);
    } catch (err) {
      return done(err, false);
    }
  })
);

// Google OAuth Strategy (optional)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_BASE_URL}/auth/google/callback`,
        scope: ['profile', 'email'],
        state: true
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          if (!profile.emails?.[0]?.value) {
            return done(new AppError('Google account has no email', 400));
          }

          const email = profile.emails[0].value.toLowerCase();
          const { rows } = await pool.query(
            `SELECT id, email, name, avatar FROM users 
             WHERE email = $1 OR google_id = $2`,
            [email, profile.id]
          );

          let user = rows[0];

          if (!user) {
            const newUser = await pool.query(
              `INSERT INTO users 
               (email, name, avatar, google_id, is_verified) 
               VALUES ($1, $2, $3, $4, true)
               RETURNING id, email, name, avatar`,
              [
                email,
                profile.displayName,
                profile.photos?.[0]?.value || null,
                profile.id
              ]
            );
            user = newUser.rows[0];
          }

          user.token = generateToken(user.id);
          return done(null, user);
        } catch (err) {
          return done(new AppError('Google authentication failed', 500));
        }
      }
    )
  );
}

// Session serialization (if using sessions)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, email, name, avatar FROM users WHERE id = $1',
      [id]
    );
    done(null, rows[0] || null);
  } catch (err) {
    done(new AppError('Failed to deserialize user', 500));
  }
});

module.exports = passport;