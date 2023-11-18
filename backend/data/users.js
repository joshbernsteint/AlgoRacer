const collection = require("../config/mongoCollections");
const { checkEmailAndTrim, checkAndTrim, validateMongoId, toObjectId, checkNumber } = require("../utils");


/**
 * Error Messages
 */
const userNotFound = "User could not be found";
const insertError = "User could not be created";


async function createUser(email, password, displayName){
    const trimmedEmail = checkEmailAndTrim(email);
    const trimmedPassword = checkAndTrim(password, "password");
    const trimmedName = checkAndTrim(displayName, "displayName");

    const userCollection = await collection.users();
    const result = await userCollection.insert({
        emailAddress: trimmedEmail,
        password: trimmedPassword,
        displayName: trimmedName
    });

    if(!result.acknowledged || !result.insertedId){
        throw insertError;
    }
    const newUser = await getUser(result.insertedId.toString());
    return newUser;
}

async function getUser(id){
    const new_id = validateMongoId(id);
    const userCollection = await collection.users();
    const user = await userCollection.findOne({_id: toObjectId(new_id)});
    if(user === null){
      throw userNotFound;
    };
    return user;
}

async function changePassword(userId, newPassword){
    const psswrd = checkAndTrim(newPassword, "newPassword");
    const id = validateMongoId(userId);
    const userCollection = await collection.users();
    const updated = await userCollection.findOneAndUpdate({_id: toObjectId(id)}, {$set: {password: psswrd}}, {returnDocument: 'after'});
    if(!updated) throw "password could not be updated";
    return {_id: updated._id.toString(), updated: true, field: "password"};
}

async function changeDisplayName(userId, newName){
    const name = checkAndTrim(newName, "newName");
    const id = validateMongoId(userId);
    const userCollection = await collection.users();
    const updated = await userCollection.findOneAndUpdate({_id: toObjectId(id)}, {$set: {displayName: name}}, {returnDocument: 'after'});
    if(!updated) throw "displayName could not be updated";
    return {_id: updated._id.toString(), updated: true, field: "displayName"};
}

async function updateStats(userId, difficulty, time_taken, got_score){
    const id = validateMongoId(userId);
    const diff = checkAndTrim(difficulty);
    const time = checkNumber(time_taken, "time_taken");
    const score = checkNumber(got_score, "got_score");

    const user = await getUser(id);
    const newStats = user.stats[diff];

    //Replace high score time (if necessary)
    if(newStats.high_score < score){
        newStats.high_score = score;
        newStats.high_score_time = time;
    }

    newStats.time_spent += time;
    const totalScores = newStats.average_score * newStats.games_played;
    newStats.average_score = (totalScores + score) / (newStats.games_played + 1);
    newStats.games_played++;

    const userCollection = await collection.users();
    const updated = await userCollection.findOneAndUpdate({_id: toObjectId(id)}, {$set: {[`stats.${diff}`]: newStats}}, {returnDocument: 'after'});
    if(!updated) throw "displayName could not be updated";
    return {_id: updated._id.toString(), updated: true, field: `stats.${diff}`};
}

module.exports = {
    createUser: createUser,
    getUser: getUser,
    updateStats: updateStats,
    changeDisplayName: changeDisplayName,
    changePassword: changePassword
}