const http = require('http')
const httpProxy = require('http-proxy')
const { CognitoJwtVerifier } = require('aws-jwt-verify')

const port = 4567

const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: process.env.AWS_USER_POOLS_ID,
    tokenUse: "access",
    clientId: process.env.APP_CLIENT_ID,
});

const proxy = httpProxy.createProxyServer({})

proxy.on('proxyReq', async (proxyReq, req, res, options) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, traceparent');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, HEAD, POST, DELETE');

    console.log("auth: ", req.headers.authorization?.startsWith("Bearer"))
    // try {
    //     if (!req.headers["authorization"]?.startsWith("Bearer")) {
    //         res.statusCode = 401
    //         return res.end("invalid token")
    //     }

    //     const token = req.headers["authorization"].replace("Bearer ", "");
    //     const user = await jwtVerifier.verify(token);
    //     req.setHeader('user', JSON.stringify(user));
    //     console.log("req.headers:", req.headers)

    //     // proxyReq.setHeader('User', JSON.stringify(user));

    //     return proxyReq;

    //   } catch (err) {
    //     console.error({err})
    //     res.statusCode = 401
    //     return res.end('Invalid token')
    //   }
    }
)

const server = http.createServer((req, res) => {
    proxy.web(req, res, {
        target: "http://localhost:4568",
        changeOrigin: true
    });
})

jwtVerifier
    .hydrate()
    .catch((err) => {
        console.error(`Failed to hydrate JWT verifier: ${err}`);
        process.exit(1);
    })
    .then(() =>
        server.listen(process.env.PORT || port, () => {
            console.log(`proxy app listening at ${process.env.PORT || port}`);
        })
    );