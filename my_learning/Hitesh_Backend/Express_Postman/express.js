// import express from "express";

// const app = express();

// const PORT = 3000;
// const localhost = "127.0.0.1";

// app.get("/", (req, res) => {
//   res.send("Hello Owner from Express");
// });

// every time u make a change u have to restart the server again and again so it is better to restart , install nodemon but remember download nodemon for dev dependencies not for production ok so use or we can use [node --watch-path=./someFolder someFile.js] or [node --watch someFile.js] but it is not recommended so use nodemon instead of this command

// npm i -D nodemon

/* Use the --watch flag with the node command followed by the filename of your main server file.
Example: node --watch index.js   */

// app.get("/about", (req, res) => {
//   res.send("You are in About page my lord");
// });

// app.get("/login", (req, res) => {
//   res.send("Successfully login... Welcome to the dashboard");
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port http://${localhost}:${PORT}`);
// });

//! we are moving to express2.js to in package.json change the main and both command "start" and "dev"
