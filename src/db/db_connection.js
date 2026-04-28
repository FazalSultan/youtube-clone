import mongoose from "mongoose";
import { DB_Name } from "../constants/constant.js";

export const databaseConnection = async () => {
  try {
    const conectionInstance = await mongoose.connect(
      `${process.env.DB_URL}/ ${DB_Name}`,
    );
    console.log(
      "Database is Connected Successfully [From db_connection file]: ",
      conectionInstance.connection.host,
    );
  } catch (error) {
    console.log("Database connection Failed ...", error);
  }
};
