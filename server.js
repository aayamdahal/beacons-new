const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const colors = require("colors");
const bodyParser = require("body-parser");
const express = require("express");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://beacons-c9136.firebaseio.com"
  });

const csrfMiddleware = csrf({ cookie: true });

const PORT = process.env.PORT || 3000;

const app = express();

app.engine("html", require("ejs").renderFile);
app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

app.all("*", (req,res,next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

app.get("/login", (req, res) => {
    res.render("login.html");
});

app.get("/signup", (req,res)=> {
    res.render("signup.html");
});

app.get("/profile", (req,res)=> {
   const sessionCookie = req.cookies.session || "";

   admin
   .auth()
   .verifySessionCookie(sessionCookie, true /** checkRevoked */)
   .then(()=> {
       res.render("profile.html");
   })
   .catch((error) => {
       res.redirect("/login")
   });
});

// Home
app.get("/", (req,res)=> {
    res.render("index.html");
});

// Blogs
app.get("/blogs", (req,res) => {
    res.render("blogs.html");
});

// Blogs2
app.get("/blogs2", (req,res) => {
    res.render("blogs2.html");
});

// Digital Store
app.get("/digitalstore", (req,res) => {
    res.render("digital store.html");
});

// Taking Commissions
app.get("/commissions", (req,res) => {
    res.render("taking commissions.html");
});

// Leveling up Links
app.get("/links", (req,res) => {
    res.render("leveling up your links.html");
});

// Getting Started
app.get("/gettingstarted", (req,res) => {
    res.render("getting started.html");
});

// Featuring a video
app.get("/featuring", (req,res) => {
    res.render("featuring a video.html");
});

// Merchants
app.get("/merchants", (req,res) => {
    res.render("merchants.html");
});

//Pricing
app.get("/pricing", (req,res) => {
    res.render("pricing.html");
});

// Updates
app.get("/updates", (req,res) => {
    res.render("updates.html");
});

// Change log psot
app.get("/changelog", (req,res)=> {
    res.render("changelog-post.html")
})

// tips
app.get("/tips", (req,res)=> {
    res.render("tips.html")
})


// tips2
app.get("/tips2", (req,res)=> {
    res.render("tips2.html")
})

// research
app.get("/research", (req,res)=> {
    res.render("research.html")
})

// gallery
app.get("/gallery", (req,res)=> {
    res.render("gallery.html")
})

// gallery-user
app.get("/gallery-user", (req,res)=> {
    res.render("gallery-user.html")
})

// gallery
app.get("/gallery", (req,res)=> {
    res.render("gallery.html")
})

// gallery
app.get("/shop", (req,res)=> {
    res.render("shop.html")
})


// home
app.get("/home", (req,res)=> {
    res.render("home.html")
})

// foodanddrink
app.get("/foodanddrink", (req,res)=> {
    res.render("foodanddrink.html")
})

// jewlery
app.get("/jewlery", (req,res)=> {
    res.render("jewlery.html")
})

// jewlery
app.get("/paper", (req,res)=> {
    res.render("paper.html")
})

// Forgot password
app.get("/forgotpass", (req,res)=> {
    res.render("forgotpass.html")
})

// Post request
app.post("/sessionLogin", (req,res) => {
    const idToken = req.body.idToken.toString();
    
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    admin 
    .auth()
    .createSessionCookie(idToken, {expiresIn})
    .then(
        (sessionCookie) => {
            const options = {maxAge: expiresIn, httpOnly: true};
            res.cookie("session", sessionCookie, options);
            res.end(JSON.stringify({status: "success"}));
        },
        (error) => {
            res.status(401).send("UNAUTHORIZED REQUEST!");
        }
    );
});

app.get("/sessionLogout", (req,res) => {
    res.clearCookie("session");
    res.redirect("./login");
});

app.listen(PORT, ()=> {
    console.log(`Working Bruh http://localhost:${PORT}`.blue.bold);
});  