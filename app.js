const express = require('express');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const app = express();

// Load env variables
dotenv.config({ path: './config/.env' });

// Handlebars set up
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Routes
app.use('/', require('./routes/index'));

const port = process.env.PORT;

// Listen
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
