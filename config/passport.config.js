const jwt = require('jsonwebtoken')
const { userModel } = require('../models/user.models')
const { default: mongoose } = require('mongoose')

const GoogleStrategy = require('passport-google-oauth20').Strategy

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY,
        callbackURL: 'https://curious-mite-outerwear.cyclic.app/google/callback',
        prompt: 'consent',
        scope: ['profile', 'email'],
        state: true
    },
        async function (accessToken, refreshToken, profile, done) {


            try {

                const isExistUser = await userModel.findOne({ email: profile._json.email })

                if (isExistUser) {
                    const token = jwt.sign({ userId: isExistUser.oauthid }, "sayan")
                    return done(null, { token: token })
                } else {
                    await userModel.create({
                        oauthid: profile._json.sub,
                        email: profile._json.email,
                        name:profile._json.given_name,
                        oauthProvider: 'google'

                    })
                    const token = jwt.sign({ userId: profile._json.sub }, "sayan")
                    return done(null, { token: token })
                }



            } catch (error) {
                console.log(error)
            }

            //    return done(null , {token : token})

        }
    ))

    passport.serializeUser((user, done) => {
        // done(null, user);
        done(null, user.token)
    });

    passport.deserializeUser((token, done) => {
        done(null, token);


    });
}