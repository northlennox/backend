const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const cors       = require('cors');
const session    = require('express-session');

require('./db/db');

app.use(session({
  secret: 'nyamissi',
  resave: false,
  saveUninitialized: false
}));


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


const corsOptions = {
  origin: ['http://localhost:3000', 'https://localhost:3000', 'https://electricasa-frontend.herokuapp.com', 'http://electricasa-frontend.herokuapp.com'],
  credentials: true,
  optionsSuccessStatus:200
}

app.use(cors(corsOptions));
app.use('/public', express.static('public'));

const authControllers = require('./controllers/authControllers');
const userControllers = require('./controllers/userControllers');
const houseControllers = require('./controllers/houseControllers');
const roofControllers = require('./controllers/roofControllers');
const atticControllers = require('./controllers/atticControllers');
const spHeaterControllers = require('./controllers/spHeaterControllers');
const waHeaterControllers = require('./controllers/waHeaterControllers');
const utilityControllers = require('./controllers/utilityControllers');

app.use('/api/v1/auth', authControllers);
app.use('/api/v1/users', userControllers);
app.use('/api/v1/house', houseControllers);
app.use('/api/v1/attic', atticControllers);
app.use('/api/v1/roof', roofControllers);
app.use('/api/v1/spHeater', spHeaterControllers);
app.use('/api/v1/waHeater', waHeaterControllers);
app.use('/api/v1/utility', utilityControllers);

app.listen(process.env.PORT || 9000, () => {
  console.log('I am working...')
});
