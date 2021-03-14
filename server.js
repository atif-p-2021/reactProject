const https = require("https");
const express = require("express");
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const bigQueryHandlers = require("./server_handlers/bigquery-handlers");
const PORT = process.env.PORT || 8080;
const fs = require("fs");
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

app.use(cors())
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(express.static("build"));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/build/index.html");
});

app.use("/push", bigQueryHandlers.testPush);
app.use("/test", bigQueryHandlers.testPull);
app.use("/rawSchema", bigQueryHandlers.rawSchema);
app.use("/privacy", bigQueryHandlers.privacy);
app.use("/retention", bigQueryHandlers.retention);
app.use("/GBQTables", bigQueryHandlers.GBQTables);
app.use("/GBQDatasets", bigQueryHandlers.GBQDatasets);


if (isProduction) {
	try {
		//Make sure to copy your Private Key and Certificate to the correct location
		//On linux: /etc/geo/certificates/*
		//On windows: C:\etc\geo\certificates\*
		const httpsOptions = {
			key: fs.readFileSync(path.join("/", "etc", "geo", "certificates", "serverPRIVATE.pem")),
			cert: fs.readFileSync(path.join("/", "etc", "geo", "certificates", "serverPUBLIC.pem"))
		};
		https.createServer(httpsOptions, app).listen(8080, () => console.log("Listening..."));
	} catch (e) {
		app.get("*", (req, res) => {
			res.send("There was an error in fetching keys", e);
		});
		app.listen(PORT);
	}
} else {
	// Serve the files on port 8080.
	app.listen(PORT, function () {
		console.log("Example app listening on port " + PORT);
	});
}
