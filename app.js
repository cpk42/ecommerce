const bodyParser = require('body-parser');
const express = require('express');
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
