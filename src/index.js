const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('OK!');
})

require('./app/controlers/index')(app);

app.listen(process.env.PORT, () => {
    console.log(`bbt_cientec_api - PORT ${process.env.PORT}`);
});