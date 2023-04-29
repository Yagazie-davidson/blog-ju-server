const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db,
	dbConnectionStr = process.env.DB_STRING,
	dbName = "dev";

// talk to mongo DB
MongoClient.connect(
	"mongodb+srv://Letam:Examination@dev.iyanmtm.mongodb.net/?retryWrites=true&w=majority",
	{ useUnifiedTopology: true }
).then(client => {
	console.log(`Connected to ${dbName} Database`);
	db = client.db(dbName);
});

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

// Get all blog posts
app.get("/api/post/all", function (req, res) {
	db.collection("blog-post")
		.find()
		.toArray()
		.then(data => {
			res.json(data);
		})
		.catch(error => console.error(error));
});

// Get blog post by title
app.get("/api/blog/post/:title", function (req, res) {
	db.collection("blog-post")
		.find({ title: req.params.title })
		.toArray()
		.then(data => {
			console.log(data);
			res.json(data);
		})
		.catch(error => console.error(error));
});

// post blog post
app.post("/api/post/new", function (req, res) {
	console.log(req.body);
	db.collection("blog-post")
		.insertOne({
			id: Math.floor(100000 + Math.random() * 900000),
			title: req.body.title,
			body: req.body.body,
			date: req.body.date,
			user: req.body.userName,
		})
		.then(result => {
			console.log("Post Added");
		})
		.catch(error => console.error(error));
	res.json({ status: 200, message: "Post successfully added" });
});

// edit blog post body
app.put("/api/post/edit", (req, res) => {
	console.log(req.body);
	db.collection("blog-post")
		.findOneAndUpdate(
			{ title: req.body.title },
			{
				$set: {
					body: req.body.body,
				},
			},
			{
				upsert: true,
			}
		)
		.then(result => {
			res.json("Success");
		})
		.catch(error => console.error(error));
});

// get blog post by userName
app.get("/api/post/:user", (req, res) => {
	console.log(req.params.user);
	db.collection("blog-post")
		.find({ user: req.params.user })
		.toArray()
		.then(data => {
			res.json(data);
		});
});

//  delete post
app.delete("/api/post/delete/:title", (req, res) => {
	db.collection("blog-post")
		.deleteOne({ title: req.params.title })
		.then(result => {
			res.json(`Deleted Post ${req.params.id}`);
		})
		.catch(error => console.error(error));
});

app.listen(7000, function () {
	console.log("listening on 7000");
});
