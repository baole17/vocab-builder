const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
global.Vocab = require('./api/models/vocabModel');
const routes = require('./api/routes/vocabRoutes');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://lebao17:Sinhvien%40123@paolee.i91rp.mongodb.net/?retryWrites=true&w=majority&appName=paolee',
    {useNewUrlParser: true }
);
const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);
app.listen(port);
app.use((req,res) => {
    res.status(404).send({ url: `${req.originalUrl} not found`});
});
console.log(`Server start on port  ${port}`);