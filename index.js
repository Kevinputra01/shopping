require("dotenv").config();
const express = require("express");
const cors = require("cors");

//websocket server
const http = require("http");
const router = require("./src/routes/index");

const app = express();

const server = http.createServer(app);

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

//not found
app.use((req, res) => {
    res.sendStatus(404);
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
