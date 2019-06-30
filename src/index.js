require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    '/files', 
    express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
);

app.get('/', (req, res) => {
    res.send('OK!');
})

require('./app/controlers/index')(app);

app.listen(process.env.PORT, () => {
    console.log(`bbt_cientec_api - PORT ${process.env.PORT}`);
});