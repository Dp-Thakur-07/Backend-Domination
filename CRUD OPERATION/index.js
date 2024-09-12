const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override");

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// Setting up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

let posts = [
    { id:uuidv4(), username: "apnecollage", content: "I love coding " },
    { id:uuidv4(),username: "DPthakur", content: "smile is the best reaction" },
    { id:uuidv4(),username: "sanjay", content: "I got internship" }
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
app.post("/posts", (req, res) => {
    let { username, content } = req.body;
    let id =uuidv4();
    posts.push({ id,username, content });
    res.redirect("/posts"); // Redirect to /posts after submission
});

app.get("/posts/:id" , (req,res) =>{
    let { id } = req.params;
    let post = posts.find((p) =>id ===p.id);
    res.render("show.ejs",{post});
})
app.patch("/posts/:id" , (req,res) =>{
    let { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) =>id ===p.id);
    post.content = newContent;
    console.log(post);
    res.redirect("/posts");
});
app.get("/posts/:id/edit" , (req,res) =>{
    let { id } = req.params;
    let post = posts.find((p) =>id ===p.id);
    res.render("edit.ejs",{post});

});
app.delete("/posts/:id",(req,res)=>{
    let {id} = req.params;
     posts = posts.filter((p) =>id !==p.id);
    res.redirect("/posts");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
