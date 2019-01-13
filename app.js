const MongoStore = require('connect-mongo')(session);
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');

//Create express app
const app = express();
const port = 3001

//Initialize body-parser
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')))

//Route main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/pages/index.html"))
})

//Listent on port 3001
app.listen(port, () => {
    console.log(`Ecommerce app listening on port ${port}!`)
})
