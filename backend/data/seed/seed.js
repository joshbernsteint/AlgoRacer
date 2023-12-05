const connect = require("../../config/mongoConnection");

const userFunctions = require('../users');
const leaderboardFunctions = require('../leaderboard');


async function seed(){
    const db = await connect.dbConnection();
    db.dropDatabase();

    const user = await userFunctions.createUser("josh@gmail.com","HelloWorld!72","josh2");
    const user2 = await userFunctions.createUser("jo2sh@gmail.com","HelloWorld!72","josh21");
    
    const l1 = await leaderboardFunctions.createLeaderboard("Bubble Sort");
    const l2 = await leaderboardFunctions.createLeaderboard("Insertion Sort");
    const l3 = await leaderboardFunctions.createLeaderboard("Selection Sort");

    const run1 = await leaderboardFunctions.addToLeaderboard(user._id.toString(),l1.name,582,15,Date.now(),"Insane");
    const run2 = await leaderboardFunctions.addToLeaderboard(user._id.toString(),l1.name,321,17,Date.now(),"Insane");

    const run3 = await leaderboardFunctions.addToLeaderboard(user2._id.toString(),l1.name,213,20,Date.now(),"Beginner");
    const run4 = await leaderboardFunctions.addToLeaderboard(user._id.toString(),l1.name,413,7,Date.now(),"Normal");


    await leaderboardFunctions.addToLeaderboard(user._id.toString(),l2.name,213,5,Date.now(),"Insane");
    await leaderboardFunctions.addToLeaderboard(user._id.toString(),l2.name,18,1,Date.now(),"Beginner");
    await leaderboardFunctions.addToLeaderboard(user2._id.toString(),l2.name,351,11,Date.now(),"Beginner");
    await leaderboardFunctions.addToLeaderboard(user._id.toString(),l2.name,110,4,Date.now(),"Normal")
    

    await leaderboardFunctions.addToLeaderboard(user._id.toString(),l3.name,4001,25,Date.now(),"Normal");
    await leaderboardFunctions.addToLeaderboard(user._id.toString(),l3.name,35,3,Date.now(),"Insane");
    await leaderboardFunctions.addToLeaderboard(user2._id.toString(),l3.name,109,9,Date.now(),"Beginner");
    await leaderboardFunctions.addToLeaderboard(user._id.toString(),l3.name,58,3,Date.now(),"Normal");;
    
    console.log(run1);

    await connect.closeConnection();
}

seed();