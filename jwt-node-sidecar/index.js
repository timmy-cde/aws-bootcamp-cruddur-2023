const express = require('express');
const { urlencoded } = require('express');
const cors = require('cors');
const httpProxy = require('http-proxy')
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

const proxy = httpProxy.createProxyServer()
const app = express()
const port = 4568;

// app.use(cors())
app.use(express.json())
app.use(urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, traceparent');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, HEAD, POST, DELETE');
    next();
});

const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: process.env.AWS_USER_POOLS_ID,
    tokenUse: "access",
    clientId: process.env.APP_CLIENT_ID,
});

// app.get("/", async (req, res, next) => {
//     // console.log("----node-sidecar start----")
//     try {
//         // A valid JWT is expected in the HTTP header "authorization"
//         // // token = req.body.auth.split(' ')
//         // access_token = token[1]
//         // const claims = await jwtVerifier.verify(access_token);
//         // res.json(claims)
//         console.log({ auth_header: req.headers.authorization })
//     } catch (err) {
//         console.error(err);
//         return res.status(403).json({ statusCode: 403, message: "Forbidden" });
//     }
//     // console.log("----node-sidecar end----")
// });

console.log("===before proxy===")

const auth = async function (req, res, next) {
    const token = req.headers.authorization;
    const access_token = token ? token.split(' ')[1] : token;

    if (!access_token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const claims = await jwtVerifier.verify(access_token);
        req.claims = claims;
        next();
    } catch (error) {
        res.status(403).json({ statusCode: 403, message: "Forbidden" });
        next(error);
    }
}

const proxyMiddleware = createProxyMiddleware({
    target: process.env.BACKEND_URL,
    changeOrigin: true,
    selfHandleResponse: true,
    logger: console,
    on: {
        proxyReq: (proxyReq, req, res) => {
            console.log(req.claims)
            proxyReq.setHeader('X-User-Claims', JSON.stringify(req.claims))
        },
        // proxyRes: async (proxyRes, req, res) => {
        //     proxyRes.setHeader('X-User-Claims', JSON.stringify(req.claims))
        //     // proxyRes.pipe(res)
        // }
    }
})

app.use('/api', auth, proxyMiddleware)

app.use((err, req, res, next) => {
    console.error(err);
    res.status(403).json({ statusCode: 403, message: "Forbidden" });
});

// app.all('/api', async (req, res) => {
//     console.log({auth_header: req.headers.authorization})

//     const token = req.headers.authorization;
//     const access_token = token ? token.split(' ')[1] : token;
//     console.log(access_token)

//     if (!access_token) {
//         return res.status(403).json({ statusCode: 403, message: "Forbidden" });
//     }

//     try {
//         const claims = await jwtVerifier.verify(access_token);
//         console.log(claims)
//         proxy.web(req, res, {
//             target: process.env.BACKEND_URL
//         })
//     } catch (error) {
//         return res.status(403).json({ statusCode: 403, message: "Forbidden" });
//     }
// })


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

// ============================================================================

// // const { config } = require("dotenv");
// const { CognitoJwtVerifier } = require("aws-jwt-verify");
// const express = require("express");
// const proxy = require("express-http-proxy");
// const cors = require("cors");
// const app = express();
// const port = 4567;

// // config();

// const jwtVerifier = CognitoJwtVerifier.create({
//     userPoolId: process.env.AWS_USER_POOLS_ID,
//     tokenUse: "access",
//     clientId: process.env.APP_CLIENT_ID,
// })

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     allowedHeaders: ["authorization", "traceparent"],
//   })
// );

// app.use(async (req, res, next) => {
//     console.log(req.headers)
//   try {
//     if (!req.header("authorization")?.startsWith("Bearer")) {
//       throw new Error("Authorization token invalid");
//     }
//     const token = req.header("authorization").replace("Bearer ", "");
//     const user = await jwtVerifier.verify(token);
//     req.user = user;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// });

// app.get(
//   "/api/*",
//   proxy(process.env.BACKEND_URL_PROXY, {
//     proxyErrorHandler: function (err, res, next) {
//       switch (err && err.code) {
//         case "ECONNRESET": {
//           return res.status(405).send("504 became 405");
//         }
//         case "ECONNREFUSED": {
//           return res.status(200).send("gotcher back");
//         }
//         default: {
//           next(err);
//         }
//       }
//     },
//   })
// );

// // Hydrate the JWT verifier, then start express.
// // Hydrating the verifier makes sure the JWKS is loaded into the JWT verifier,
// // so it can verify JWTs immediately without any latency.
// // (Alternatively, just start express, the JWKS will be downloaded when the first JWT is being verified then)
// jwtVerifier
//   .hydrate()
//   .catch((err) => {
//     console.error(`Failed to hydrate JWT verifier: ${err}`);
//     process.exit(1);
//   })
//   .then(() =>
//     app.listen(port, () => {
//       console.log(`Example app listening at ${port}`);
//     })
//   );