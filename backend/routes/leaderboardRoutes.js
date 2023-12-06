const router = require('express').Router();
const leaderboardFunctions = require('../data/leaderboard')

router.post('/add/:id/', async (req, res) => {
    try {
        const body = req.body;
        const result = await leaderboardFunctions.addToLeaderboard(req.params.id, body.name,body.time_taken, body.got_score, body.timestamp, body.difficulty);
        res.json({added: true});
    } catch (error) {
        res.status(200).json({error: error.toString()});
    }
});

router.get('/', async (req, res) => {
    try {
        const all = await leaderboardFunctions.getAllLeaderboards();
        res.json(all);
    } catch (error) {
        console.log(error.toString());
        res.status(200).json({error: error.toString()});
    }
});

router.get('/:diff', async (req,res) => {
    try {
        const leaderboard = await leaderboardFunctions.getLeaderboardByName(req.params.diff);
        res.json(leaderboard);
    } catch (error) {
        res.status(200).json({error: error.toString()});
    }
});


module.exports = router;