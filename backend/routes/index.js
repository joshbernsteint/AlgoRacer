const userRoutes = require("./userRoutes");

const constructorMethod = (app) => {
  app.use("/", userRoutes);

  app.use("*", (req, res) => {
    res.json({ error: "Route not valid" });
  });
};

module.exports = constructorMethod;