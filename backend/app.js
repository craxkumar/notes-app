const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const db = require('./config/database');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const keycloakConfig = require('./config/keycloak-config.js').keycloakConfig;
const privateRouter = require('./router/router.js');
const publicRouter = require('./router/public.js');
const cronJob = require('./utility/cronJob.js');
require('dotenv').config();

/**
    WebSocket is a separate protocol from HTTP, 
    and to use it in your application, you need to create 
    a WebSocket server in addition to the HTTP server.
    This is why you are creating an HTTP server with http.
    createServer(app) and then passing it to socketIO to create a WebSocket server.
*/
const http = require('http');
const socketIO = require('socket.io')
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: process.env.FRONTEND_URL
    }
});


// Create a session-store to be used by both the express-session
// middleware and the keycloak middleware.
const memoryStore = new session.MemoryStore();
app.use(
    session({
        secret: 'QsP2#vR7!',
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
    }),
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
    keycloakConfig,
);

app.use(
    keycloak.middleware({
        logout: '/logout',
        admin: '/',
    }),
);


// Call the database connectivity function
db();

// Enable Cross-Origin Resource Sharing (CORS) middleware
app.use(cors());

app.use(express.json());

// Middleware to set Access-Control-Expose-Headers globally(allows custom headers)
app.use((req, res, next) => {
    res.header('Access-Control-Expose-Headers', '*');
    next();
});

// Initialise protected express router
var router = express.Router();
// Initialise unprotected express router
var public = express.Router();

// use express router
app.use('/api', keycloak.protect(), router);
app.use(public);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});


io.on('connection', (socket) => {
    // Access user ID from handshake query
    const userId = socket.handshake.query.userId;

    console.log(`User ${userId} connected`);

    socket.on('disconnect', () => {
        console.log(`User ${userId} disconnected`);
    });

    // Listen for messages from this specific user
    socket.on(userId, (message) => {
        console.log(`Received message from user ${userId}: ${message}`);
    });
});

//call routing
privateRouter(router);
publicRouter(public);

// run cron Job
cronJob();

const PORT = process.env.SERVER_PORT;

server.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
});

// signal interrupt
process.on('SIGINT', () => {
    process.exit(0);
});

// event listener for the 'uncaughtException' event
process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
});
