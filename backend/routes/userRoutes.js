const userFunctions = require('../data/users');

const router = require('express').Router();
const bcrypt = require('bcryptjs');




router.post("/register", async (req, res) => {
    try {
        const body = req.body;
        const registerResult = await userFunctions.createUser(body.emailAddress, body.password, body.displayName);
        res.cookie('isLoggedIn', registerResult._id.toString());
        res.json({id: registerResult._id.toString(), displayName: userInfo.displayName});
    } catch (error) {
        res.status(200).json({error: error.toString()});
    }
});

router.post("/login", async (req, res) => {
    try {
        const body = req.body;
        let foundUser = false;
        const allUsers = await userFunctions.getAllUsers();
        let userInfo = {};
        for (let index = 0; index < allUsers.length; index++) {
            const user = allUsers[index];
            if(body.emailAddress === user.emailAddress){
                foundUser = (await bcrypt.compare(body.password, user.password)) || foundUser;
                userInfo = {...user};
            }
        }

        if(!foundUser) throw 'Email or Password are incorrect';
        res.cookie('isLoggedIn', userInfo._id.toString());
        res.json({id: userInfo._id.toString(), displayName: userInfo.displayName});
        
    } catch (error) {
        res.status(200).json({error: error.toString()});
    }
});

router.get("/logout", async (req, res) => {
    try {        
        res.clearCookie('isLoggedIn');
        res.json({loggedOut: true});
    } catch (error) {
        res.json({error: error.toString()});
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