app.get("/", (req, res) => res.render("home", { title: "Home" }));
app.get("/login", (req, res) => res.render("login", { title: "Login" }));
app.get("/register", (req, res) => res.render("register", { title: "Register" }));
app.get("/post/:id", (req, res) => res.render("post", { title: "Post" }));
app.get("/create", (req, res) => res.render("create-post", { title: "Write" }));
app.get("/profile", (req, res) => res.render("profile", { title: "Profile" }));
app.get("/admin", (req, res) => res.render("admin", { title: "Admin Panel" }));
app.get("/my-posts", (req, res) => res.render("profile", { title: "My Posts" })); // profile sahifasida posts tab