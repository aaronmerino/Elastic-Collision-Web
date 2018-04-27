// express
const express = require('express');
const app = express();

app.use(express.static('static-content'));

app.listen(1000, () => console.log('app listening on port 1000'));