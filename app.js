const express = require('express');
const config = require("config");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongodbStore = require("connect-mongodb-session")(session);
const indexController = require('./controllers/indexController');
const MONGOOSE_URI = 'mongodb://127.0.0.1:27017/nodejs_phone';
const app = express();
const PORT = process.env.PORT || 3000;
/* session store*/
const store = new mongodbStore({
    uri: MONGOOSE_URI,
    collection: "sessions",
});
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);
// Cấu hình trình xử lý view template
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/styles', express.static(__dirname + '/styles'));
app.use(bodyParser.urlencoded({ extended: true }));
// Kết nối với MongoDB 
mongoose.connect(MONGOOSE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// Sử dụng controllers
app.use('/', indexController);
// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
