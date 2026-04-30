import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import { databaseConnection } from "./db/db_connection.js";
import { app } from "./app.js";

app.use(
  cors({
    origin: process.env.allowOrigin,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

databaseConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is Running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connection failed", err);
  });
