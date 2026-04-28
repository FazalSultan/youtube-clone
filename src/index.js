import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import { DB_Name } from "./constants/constant.js";
import { databaseConnection } from "./db/db_connection.js";

const app = express();
databaseConnection()


app.get("/", (req, res) => {
  res.send("Fast Job Fair!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
