const userRoutes = require("./userRoutes");
const leaderboardRoutes = require("./leaderboardRoutes");

const constructorMethod = (app) => {
  app.use("/", userRoutes);
  app.use("/leaderboard", leaderboardRoutes);
};

module.exports = constructorMethod;