const http = require('http')
const httpProxy = require('http-proxy')
const { CognitoJwtVerifier } = require('aws-jwt-verify')

const port = 4567

const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: process.env.AWS_USER_POOLS_ID,
    tokenUse: "access",
    clientId: process.env.APP_CLIENT_ID,
});

const proxy = httpProxy.createProxyServer({
    target: process.env.BACKEND_URL,
    changeOrigin: true
})

proxy.on('proxyReq', async (proxyReq, req, res, options) => {
    const token = req.headers.authorization
    let claims;
    if (token) {
        const access_token = token.split(' ')[1]
        claims = await jwtVerifier.verify(access_token)
        console.log({claims})
        // proxyReq.setHeader('X-Special-Proxy-Header', JSON.stringify(claims));
        // console.log(claims)
    }
    // console.log(JSON.stringify(claims))
    // let claims_json = claims ? await JSON.stringify(claims) : 'null'
    // proxyReq.setHeader('X-Special-Proxy-Header', claims_json);
    console.log({claims})
    proxyReq.setHeader('X-Special-Proxy-Header', JSON.stringify(claims));
    
})
 
proxy.on('proxyRes', (proxyRes, req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, traceparent');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, HEAD, POST, DELETE');
})

const server = http.createServer((req, res) => {
    proxy.web(req, res);
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