const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const filter = require('content-filter');

const custRoutes = require("./routes/customer");
const agentRoutes = require("./routes/agent");
const adminRoutes = require("./routes/admin");
const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");

mongoose.connect(
  "mongodb+srv://<YOUR_ID>:<YOUR_PASSWORD>@cluster0.rfvix.mongodb.net/<dbname>?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);
mongoose.Promise = global.Promise;

var blackList = ['$','{','&&','||']
var options = {
    urlBlackList: blackList,
    bodyBlackList: blackList
}

app.use(filter(options));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/customer", custRoutes);
app.use("/agent", agentRoutes);
app.use("/admin", adminRoutes);
app.use("/signup", signupRoute);
app.use("/login", loginRoute);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
