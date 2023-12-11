const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const db = require("./config/database");
const session = require("express-session");
const Keycloak = require("keycloak-connect");
const keycloakConfig = require("./config/keycloak-config.js").keycloakConfig;
const privateRouter = require("./router/router.js");
const publicRouter = require("./router/public.js");
const cronJob = require("./utility/cronJob.js");
require("dotenv").config();

/**
    WebSocket is a separate protocol from HTTP, 
    and to use it in your application, you need to create 
    a WebSocket server in addition to the HTTP server.
    This is why you are creating an HTTP server with http.
    createServer(app) and then passing it to socketIO to create a WebSocket server.
*/
const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    credentials: false,
  },
});

// Create a session-store to be used by both the express-session
// middleware and the keycloak middleware.
const memoryStore = new session.MemoryStore();
app.use(
  session({
    secret: "QsP2#vR7!",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

// Provide the session store to the Keycloak so that sessions
// can be invalidated from the Keycloak console callback.
//
// Additional configuration is read from keycloak.json file
// installed from the Keycloak web console.

const keycloak = new Keycloak(
  {
    store: memoryStore,
  },
  keycloakConfig
);

app.use(
  keycloak.middleware({
    logout: "/logout",
    admin: "/",
  })
);

// Call the database connectivity function
db();

// Enable Cross-Origin Resource Sharing (CORS) middleware
app.use(cors());

app.use(express.json());

// Middleware to set Access-Control-Expose-Headers globally(allows custom headers)
app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "*");
  next();
});

// Initialise protected express router
var router = express.Router();
// Initialise unprotected express router
var public = express.Router();

// use express router
app.use("/api", keycloak.protect(), router);
app.use(public);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Assuming you have defined the 'io' object somewhere in your code
app.post("/emitter", (req, res) => {
  try {
    // Assuming you get the list of reminder objects in the request body
    const reminderList = req.body?.reminder;
    
    // Assuming each reminder in the list has a unique '_id' property
    reminderList.forEach((reminder) => {
      // Emitting data with the 'user_id' as the event name
      io.emit(reminder.user_id, reminder);
    });

    res.send("Message sent to the specified user");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Assuming you have body-parser middleware or similar to parse JSON in the request body
app.use(express.json());

//call routing
privateRouter(router);
publicRouter(public);

// run cron Job
cronJob();

const PORT = process.env.SERVER_PORT;

server.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});

// signal interrupt
process.on("SIGINT", () => {
  process.exit(0);
});

// event listener for the 'uncaughtException' event
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
