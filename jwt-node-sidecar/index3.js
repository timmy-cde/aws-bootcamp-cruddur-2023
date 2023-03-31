const { config } = require("dotenv");
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const express = require("express");
const proxy = require("express-http-proxy");
const cors = require("cors");
const app = express();
const port = 4567;

config();

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.AWS_COGNITO_USER_POOL_CLIENT_ID,
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    allowedHeaders: ["content-type","authorization", "traceparent"],
  })
);

app.use(async (req, res, next) => {
  try {
    if (!req.header("authorization")?.startsWith("Bearer")) {
      throw new Error("Authorization token invalid");
    }
    const token = req.header("authorization").replace("Bearer ", "");
    const user = await jwtVerifier.verify(token);
    req['user'] = user;
    console.log(req)
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

app.get(
  "/api/*",
  proxy("http://localhost:4568", {
    proxyReqOptDecorator: async function(proxyReqOpts, srcReq) {
        // you can update headers
        // console.log({req})
        // proxyReqOpts.headers['user'] = user;
        // console.log({srcReq})
        // console.log("==================================")
        // console.log({proxyReqOpts})
        if (!srcReq.header("authorization")?.startsWith("Bearer")) {
            throw new Error("Authorization token invalid");
          }
        const token = srcReq.header("authorization").replace("Bearer ", "");
        const user = await jwtVerifier.verify(token);        
        proxyReqOpts.headers['User'] = JSON.stringify({user});
        console.log({proxyReqOpts})
        return proxyReqOpts;
      },
    proxyErrorHandler: function (err, res, next) {
      switch (err && err.code) {
        case "ECONNRESET": {
          return res.status(405).send("504 became 405");
        }
        case "ECONNREFUSED": {
          return res.status(200).send("gotcher back");
        }
        default: {
          next(err);
        }
      }
    },
  })
);

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
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    })
  );