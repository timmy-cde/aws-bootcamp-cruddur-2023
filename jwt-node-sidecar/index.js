const { CognitoJwtVerifier } = require("aws-jwt-verify");
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('express');

const app = express()
const port = 4000;

app.use(cors())
app.use(express.json())
app.use(urlencoded({ extended: true }))

const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: process.env.AWS_USER_POOLS_ID,
    tokenUse: "access",
    clientId: process.env.APP_CLIENT_ID,
});

app.get("/", async (req, res, next) => {
    // console.log("----node-sidecar start----")
    try {
        // A valid JWT is expected in the HTTP header "authorization"
        token = req.body.auth.split(' ')
        access_token = token[1]
        const claims = await jwtVerifier.verify(access_token);
        res.json(claims)
    } catch (err) {
        console.error(err);
        return res.status(403).json({ statusCode: 403, message: "Forbidden" });
    }
    // console.log("----node-sidecar end----")

    // res.json({ private: "only visible to users sending a valid JWT" });
});

// Hydrate the JWT verifier, then start express.
// Hydrating the verifier makes sure the JWKS is loaded into the JWT verifier,
// so it can verify JWTs immediately without any latency.
// (Alternatively, just start express, the JWKS will be downloaded when the first JWT is being verified then)
jwtVerifier
    .hydrate()
    .catch((err) => {
        console.error(`Failed to hydrate JWT verifier: ${err}`);
        process.exit(1);
    })
    .then(() =>
        app.listen(process.env.PORT || port, () => {
            console.log(`Example app listening at ${process.env.PORT || port}`);
        })
    );