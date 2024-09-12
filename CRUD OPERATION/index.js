const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
const multer = require("multer");

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Setting up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Setting up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Save uploads to /public/uploads
  },
  filename: function (req, file, cb) {
    cb(null, `${uuidv4()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage: storage });

let posts = [
  {
    id: uuidv4(),
    username: "DSA",
    content: "Consistency is the key of success! ",
    imageUrl: "https://miro.medium.com/v2/resize:fit:1024/1*lGUL34nZvS3gXv4LNAKG3Q.jpeg",
  },
  {
    id: uuidv4(),
    username: "Front-end",
    content: "Making dynamic websites!",
    imageUrl: "https://qubited.com/wp-content/uploads/2023/01/cover.jpg",
  },
  {
    id: uuidv4(),
    username: "Back-end",
    content: "Backbone of the website!",
    imageUrl: "https://media.licdn.com/dms/image/D4D12AQFnxb2cyB4ExQ/article-cover_image-shrink_600_2000/0/1669297731190?e=2147483647&v=beta&t=T2lOnIsN3NmSEfGUmWqxYnUvk53zOGf-vJac7g-hqCc",
  },
];

// Route to display all posts
app.get("/posts", (req, res) => {
  res.render("index", { posts });
});

// Route to render the form for new posts
app.get("/posts/new", (req, res) => {
  res.render("new");
});

// Route to handle form submission
app.post("/posts", upload.single("image"), (req, res) => {
  let { username, content } = req.body;
  let id = uuidv4();
  let imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Save the image path

  posts.push({ id, username, content, imageUrl });
  res.redirect("/posts"); // Redirect to /posts after submission
});

app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  res.render("show.ejs", { post });
});

app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  let newContent = req.body.content;
  let post = posts.find((p) => id === p.id);
  post.content = newContent;
  console.log(post);
  res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  res.render("edit.ejs", { post });
});

app.delete("/posts/:id", (req, res) => {
  let { id } = req.params;
  posts = posts.filter((p) => id !== p.id);
  res.redirect("/posts");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

