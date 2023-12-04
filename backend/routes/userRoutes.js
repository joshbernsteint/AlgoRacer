const userFunctions = require('../data/users');

const router = require('express').Router();
const bcrypt = require('bcryptjs');




router.post("/register", async (req, res) => {
    try {
        const body = req.body;
        const registerResult = await userFunctions.createUser(body.emailAddress, body.password, body.displayName);
        res.redirect("/login");
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.post("/login", async (req, res) => {
    try {
        const body = req.body;
        let foundUser = false;
        const allUsers = await userFunctions.getAllUsers();
        let userInfo = {};
        allUsers.forEach(async user => {
            if(body.emailAddress === user.emailAddress){
                foundUser = await bcrypt.compare(body.password, user.password);
                userInfo = {...user};
            }
        });

        if(!foundUser) throw 'Email or Password are incorrect';
        res.cookie('isLoggedIn', userInfo._id.toString());
        res.redirect("/");
        
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.get("/user/stats/:id", async (req,res) => {
    try {
        const user = await userFunctions.getUser(req.params.id);
        res.json({stats: user.stats}); 
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});


router.post("/user/stats/:id", async (req,res) => {
    try {
        const body = req.body;
        const update = await userFunctions.updateStats(req.params.id, body.difficulty,body.time_taken, body.got_score);
        res.json(update);
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});


module.exports = router;