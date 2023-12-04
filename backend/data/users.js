const collection = require("../config/mongoCollections");
const validator = require('email-validator');
const { checkEmailAndTrim, checkAndTrim, validateMongoId, toObjectId, checkNumber, validatePassword } = require("../utils");
const bcrypt = require('bcryptjs');


/**
 * Error Messages
 */
const userNotFound = "User could not be found";
const insertError = "User could not be created";

const saltRounds = 5;


async function createUser(email, password, displayName){
    const trimmedEmail = checkEmailAndTrim(email);
    const trimmedPassword = checkAndTrim(password, "password");
    const trimmedName = checkAndTrim(displayName, "displayName");

    //Check to see if email already exists
    const allUsers = await getAllUsers();
    allUsers.forEach(user => {
        if(user.emailAddress === trimmedEmail) throw 'emailAddress is already in use';
        if(user.displayName === trimmedName) throw 'displayName is already in use';
    });


    
    if(!validatePassword(trimmedPassword)) throw 'Password must be at least 8 characters long, have at least 1 number, at least 1 special character, and at least 1 uppercase character. It also must have no internal space characters';
    const hashedPassword = await bcrypt.hash(trimmedPassword, saltRounds);
    const userCollection = await collection.users();


    const result = await userCollection.insert({
        emailAddress: trimmedEmail,
        password: hashedPassword,
        displayName: trimmedName,
        stats: {
            Beginner: {
                "high_score": 0,
                "high_score_time": 0,
                "average_score": 0,
                "games_played": 0,
                "time_spent": 0
            },
            Normal: {
                "high_score": 0,
                "high_score_time": 0,
                "average_score": 0,
                "games_played": 0,
                "time_spent": 0
            },
            Insane: {
                "high_score": 0,
                "high_score_time": 0,
                "average_score": 0,
                "games_played": 0,
                "time_spent": 0
            }
        }
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

async function getAllUsers(){
    const userCollection = await collection.users();
    const res = await userCollection.find({}).toArray();
    const result = res.map(el => {
        return {_id: el._id.toString(), displayName: el.displayName, emailAddress: el.emailAddress, password: el.password};
    });
    return result;
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
    changePassword: changePassword,
    getAllUsers: getAllUsers
}