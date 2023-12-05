const cookieParser = require('cookie-parser');
const session = require('express-session');
const registerRoutes = require('./routes/index');
const express = require('express');
const path = require('path')


const PORT = 3001;
const app = express();
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
    name: 'isLoggedIn',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: false
}));


const htmlPath = path.join(__dirname, "../frontend/build/","/index.html"); //Replace with static build folder for production
app.use(express.static(path.join(__dirname,"../frontend/build/")));

registerRoutes(app);



app.get("*", (req, res) => {
    res.sendFile(htmlPath);
});



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}: http://localhost:${PORT}`);
});