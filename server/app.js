import "./config.js";
import express from "express";
import passport from "passport";
import session from "express-session";
import MySQLStore from "express-mysql-session";

import db from "./db.js";

import apiRouter from "./src/api/index.js";
import authRouter from "./src/routes/auth.js";

const app = express();
const port = 8080;

app.use(express.json());

app.use(
  session({
    secret: "secret goes here",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(
      {
        // Session store options go here
        // https://github.com/chill117/express-mysql-session#with-an-existing-mysql-connection-or-pool
      },
      db
    ),
  })
);

app.use(passport.authenticate("session"));

app.use(express.static("static"));
app.get("/", (req, res) => {
  res.redirect("/index.html");
})
app.use("/", authRouter);
app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).send("Page not found");
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Started server on port http://localhost:${port}/`);
});
