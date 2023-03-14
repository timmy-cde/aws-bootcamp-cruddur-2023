const express = require('express')
const cors = require('cors');
const { urlencoded } = require('express');


const app = express()
const port = 4000;

app.use(cors())
app.use(express.json())
app.use(urlencoded({extended: true}))

app.use('/auth/verify', () => {
    console.log('Hello')
})

app.listen(process.env.PORT || port, () => {
    console.log(`JWT Sidecar is now online on port ${process.env.PORT || port}`)
})