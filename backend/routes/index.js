const userRoutes = require("./userRoutes");

const constructorMethod = (app) => {
  app.use("/", userRoutes);
};

module.exports = constructorMethod;