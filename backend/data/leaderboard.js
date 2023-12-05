const collection = require("../config/mongoCollections");
const userFunctions = require('./users')
const {checkAndTrim, validateMongoId, toObjectId, checkNumber } = require("../utils");

const boardNotFound = "Leaderboard could not be found";
const insertError = "Leaderboard could not be created";
const sameNameError = "Cannot insert leaderboard with the same name"

async function createLeaderboard(name){
    const trimmedName = checkAndTrim(name, "name");
    const leaderboardCollection = await collection.leaderboards();

    const allLeaderboards = await getAllLeaderboards();
    allLeaderboards.forEach(el => {
        if(el.name === trimmedName) throw sameNameError;
    });

    const result = await leaderboardCollection.insertOne({
        name: trimmedName,
        difficulties: ["Beginner", "Normal", "Insane"],
            Beginner: [],
            Normal: [],
            Insane: []
    });

    if(!result.acknowledged || !result.insertedId){
        throw insertError;
    }
    const newLeaderboard = await getLeaderboardById(result.insertedId.toString());
    return newLeaderboard;
}

async function getLeaderboardById(leaderboardId){
    const id = validateMongoId(leaderboardId);
    const leaderboardCollection = await collection.leaderboards();
    const board = await leaderboardCollection.findOne({_id: toObjectId(id)});
    if(board === null){
      throw boardNotFound;
    };
    return board;
}

async function getLeaderboardByName(name){
    const trimmedName = checkAndTrim(name, "name");
    const leaderboardCollection = await collection.leaderboards();
    const board = await leaderboardCollection.findOne({name: trimmedName});
    if(board === null){
        throw boardNotFound;
    };
    return board;
}

async function getAllLeaderboards(){
    const leaderboardCollection = await collection.leaderboards();
    const boards = await leaderboardCollection.find({}).toArray();
    if(!boards) throw "Error: Could not find any leaderboards";
    return boards;
}

async function addToLeaderboard(userId, leaderboardName, time_taken, got_score, run_timestamp, difficulty){
    const user = await userFunctions.getUser(userId);
    const boardName = checkAndTrim(leaderboardName);
    const time = checkNumber(time_taken, "time_taken");
    const score = checkNumber(got_score, "got_score");
    const timestamp = checkNumber(run_timestamp, "run_timestamp");
    const diff = checkAndTrim(difficulty, "difficulty");

    const currentBoard = await getLeaderboardByName(boardName);
    if(!currentBoard.difficulties.includes(diff)) throw 'Invalid difficulty';
    const ranking = currentBoard[diff];
    const sameScore = [];
    const allOtherScores = [];
    ranking.forEach(el => {
        if(el.score === score){
            sameScore.push(el);
        }
        else{
            allOtherScores.push(el);
        }
    });
    sameScore.push({
        displayName: user.displayName,
        time_taken: time,
        score: score,
        timestamp: timestamp
    });
    sameScore.sort((a,b) => {a.time_taken - b.time_taken});

    const combined = [];
    allOtherScores.forEach(el => {
        if(el.score > score){
            combined.push(el);
        }
    });

    combined.push(...sameScore);

    allOtherScores.forEach(el => {
        if(el.score < score){
            combined.push(el);
        }
    });

    const leaderboardCollection = await collection.leaderboards();
    const updated = await leaderboardCollection.findOneAndUpdate({_id: currentBoard._id}, {$set: {[diff]: combined}}, {returnDocument: "after"});
    if(!updated) throw "leaderboard could not be updated";
    return {_id: updated._id.toString(), newRanking: combined};
    
}

module.exports = {
    createLeaderboard: createLeaderboard,
    getAllLeaderboards: getAllLeaderboards,
    getLeaderboardById: getLeaderboardById,
    getLeaderboardByName: getLeaderboardByName,
    addToLeaderboard: addToLeaderboard
}