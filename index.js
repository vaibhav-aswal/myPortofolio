// Required Dependencies
const express = require("express"); // Express.js for server and routing
const path = require("path"); // For handling and transforming file paths
const cors = require("cors"); // Middleware for enabling cross-origin resource sharing
const bodyParser = require("body-parser"); // Parse incoming request bodies
const config = require("./config"); // Configuration file
const axios = require("axios"); // Promise based HTTP client for the browser and node.js
const { json } = require("body-parser"); // Extracting JSON from body-parser

// Initializing Express app
const app = express();
// Setting port. Use environment's port if available or default to 3000
const port = process.env.PORT || 3000;

// Setting the views directory and view engine for the app
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable cross-origin resource sharing
app.use(cors());
// Serve static assets from the public/assets directory
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// Default route
app.get("/", (req, res) => {
  // NOTE: The following axios call was causing issues and is commented out temporarily
  // Fetch repo information from GitHub for the specified user
  // axios({
  //     method: "get",
  //     url: `https://api.github.com/users/${config.githubUsername}/repos`,
  //     headers: {
  //         Authorization: `Bearer ${config.githubToken}`,
  //         "Content-Type": "application/json",
  //         "Accept": "application/vnd.github.mercy-preview+json" // Header to include GitHub topics in the response
  //     }
  // }).then(response => {
  //    repoInfo = response.data;
  //    res.render('index', {
  //     repoInfo: repoInfo
  // });
  // })
  // .catch(err => {
  //     console.log(err);  // Log any errors
  // });
  res.render("index"); // Render the index view
});

// Route to fetch and display projects
app.get("/projects", (req, res) => {
  // Fetch repo information from GitHub for the specified user
  let repoInfo;
  axios({
    method: "get",
    url: `https://api.github.com/users/${config.githubUsername}/repos`,
    headers: {
      Authorization: `Bearer ${config.githubToken}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.mercy-preview+json", // Header to include GitHub topics in the response
    },
  })
    .then((response) => {
      repoInfo = response.data; // Store the fetched repo data
      res.render("projects", {
        repoInfo: repoInfo, // Send repo data to the projects view
      });
    })
    .catch((err) => {
      console.log(err); // Log any errors
    });
});

// Start the server
app.listen(port, () => {
  console.log(`listening on port: ${port}`); // Log the port number the server is listening on
});
