/**
 * By @sblack4, written for anyone
 * Props to http://www.oracle.com/webfolder/technetwork/tutorials/obe/cloud/apaas/node-cloud-REST-DB/nodecloud-RESTDB.html
 */
const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');

// if using a different port
// set port number as enviorment variable PORT
const PORT = process.env.PORT || 8081;

// server instance 
const app = express();

// connection properties to our database 
const connectionProperties = {
    user: process.env.DBAAS_USER_NAME || "oracle",
    password: process.env.DBAAS_USER_PASSWORD || "oracle",
    connectString: process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR || "localhost/xe"
};

/**
 * Releases Database Connection
 * @param {*} connection 
 */
function doRelease(connection) {
    connection.release(function(err) {
        if (err) {
            console.error(err.message);
        }
    });
}

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: '*/*' }));

const router = express.Router();

/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function headerSetter(request, response, next) {

    // log request & body to console 
    console.log("REQUEST:" + request.method + "   " + request.url);
    console.log("BODY:" + JSON.stringify(request.body));

    // 
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);

    // pass request to next appropriate handler
    next();
}
router.use(headerSetter)

/**
 * 
 * @param {*} request 
 * @param {*} response 
 */
function handleGetRequest(request, response) {
    console.log("GET TOPICS");
    oracledb.getConnection(connectionProperties, function(err, connection) {
        if (err) {
            console.error(err.message);
            response.status(500).send("Error connecting to DB");
            return;
        }
        connection.execute("SELECT id, title FROM topics", { outFormat: oracledb.OBJECT },
            function(err, result) {
                if (err) {
                    console.error(err.message);
                    response.status(500).send("Error getting data from DB");
                    doRelease(connection);
                    return;
                }
                console.log("RESULTSET:" + JSON.stringify(result));
                var topics = [];
                result.rows.forEach(function(element) {
                    topics.push({ id: element.ID, title: element.TITLE });
                }, this);
                response.json(topics);
                doRelease(connection);
            });
    });
}
router.route("/").get(handleGetRequest);

/**
 * 
 * @param {*} request 
 * @param {*} response 
 */
function handlePostRequest(request, response) {
    console.log("POST TOPIC:");
    oracledb.getConnection(connectionProperties, function(err, connection) {
        if (err) {
            console.error(err.message);
            response.status(500).send("Error connecting to DB");
            return;
        }

        var body = request.body;

        connection.execute("INSERT INTO topics(title, text) VALUES(:title, :text)", [body.title, body.text],
            function(err, result) {
                if (err) {
                    console.error(err.message);
                    response.status(500).send("Error saving topic to DB");
                    doRelease(connection);
                    return;
                }
                response.end();
                doRelease(connection);
            });
    });
}
app.route("/").post(handlePostRequest);

app.use('/', router);

// starts server
app.listen(PORT, (error) => {
    if (error) {
        console.error(error);
    }
    console.log(`Server listening on port ${PORT}`);
});