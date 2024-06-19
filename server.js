const express = require('express');
const PORT = process.env.PORT || 5000
const app = express()

app.use(require('./routes/index'))

app.listen(() => {
    console.log(`server running at port: ${PORT}`)
})