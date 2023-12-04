const validator = require('email-validator');
const mongo = require("mongodb");


function checkAndTrim(str, label){
    if(typeof str !== "string") throw `${label} must exist and be a string`;
    const trimmed = str.trim();
    if(trimmed.length === 0) throw `${label} must not be only empty spaces`;
    return trimmed;
}

function checkEmailAndTrim(email){
    if(typeof email !== "string") throw `Given email must exist and be a string`;
    const trimmed = email.trim();
    const isValid = validator.validate(trimmed);
    if(!isValid) throw "Given email must be in the valid format";
    return trimmed;
}

function validateMongoId(testId){
    const id = checkAndTrim(testId, "testId");
    if(!mongo.ObjectId.isValid(id)) throw "testId must be a valid ObjectId";
    return id;
}

function toObjectId(str_id){
    if(typeof str_id === "undefined"){
        return new mongo.ObjectId();
    }
    const id = validateMongoId(str_id);
    return new mongo.ObjectId(id);
}

function validatePassword(password){
    const psswrd = password;
    if(psswrd.search(/^\s+$/) !== -1) return false;
    if(psswrd.length < 8) return false;
    if(psswrd.search(/^[A-Z]/) === -1 || psswrd.search(/[0-9]/) === -1 || psswrd.search(/[\s]/) !== -1 || psswrd.search(/[^A-Za-z0-9]/) === -1) 
      return false;
    return true;
}

/**
 * Checks to see if the passed in value is a number and exists
 * @param {*} num Number to be checked
 * @param {*} label Name of the variable (for error message purposes)
 * @returns The number
 */
function checkNumber(num, label){
    if(typeof num !== "number" || isNaN(num)) throw `${label} must exist and be a number`;
    return num;
}


module.exports = {
    checkAndTrim: checkAndTrim,
    checkEmailAndTrim: checkEmailAndTrim,
    validateMongoId: validateMongoId,
    toObjectId: toObjectId,
    checkNumber: checkNumber,
    validatePassword: validatePassword
}