import mongoose from "mongoose";
import config from "./config/config";
import app from "./app";

mongoose.set("strictQuery", false);
mongoose
  .connect(config.databaseUri)
  .then(() => console.log("Connected to database"))
  .catch((err) => {
    console.log("Error connecting to database");
    console.log(err);
  });

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
  server.close(() => {
    console.log("Server closed");
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception thrown");
  console.log(err);
  server.close(() => {
    console.log("Server closed");
    process.exit(1);
  });
});
