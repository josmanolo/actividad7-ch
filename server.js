const express = require("express");
const handlebars = require("express-handlebars");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const { optionsSq } = require("./sqlite3/connection");
const knex = require("knex")(optionsSq);

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

//console.log([productsList, messagesList])

app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views",
    })
);

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
    try{
        const query1 = await knex.select('*').from('messages');
        console.log(query1);
        res.render('index', { list: query1 });
       } catch(e){
          console.log(e)
       }
});

io.on("connection", (socket) => {
    socket.on("new-message", (msg) => {
        knex("messages")
            .insert(msg)
            .then((data) => {
                console.log(data);
                return data;
            })
            .catch((err) => {
                console.log(err);
            })

        knex.from("messages")
            .select("*")
            .then((res) => {
                console.log(res);
                io.sockets.emit("new-message-server", res);
                return;
            })
            .catch((err) => err)
    });
});

const port = 9000;
httpServer.listen(port, () => {
    console.log(`Server running port ${port}`);
});
