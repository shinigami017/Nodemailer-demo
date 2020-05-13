const express = require("express"),
    path = require("path"),
    bodyParser = require("body-parser"),
    nodemailer = require("nodemailer"),
    port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.get("/contact", function(req, res) {
    res.render("contact");
});

app.post("/contact/send", function(req, res) {
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: /*<sender's email>*/ ,
            pass: /*<sender's password>*/
        }
        // sender need to allow permission on this link for the above mentioned sender's email
        // https://www.google.com/settings/security/lesssecureapps
    });
    var mailOptions = {
        from: "**Sender** <**sender's email**>",
        // to: "**any specific email id**",
        to: req.body.email,
        subject: "Website Submission",
        text: "You have a submission with following details... Name : " + req.body.name + " Email : " + req.body.email + " Message : " + req.body.message,
        html: "<p>You have a submission with following details...</p><ul><li>Name : " + req.body.name + "</li><li>Email : " + req.body.email + "</li><li>Message : " + req.body.message + "</li></ul>"
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.redirect("/contact");
        } else {
            console.log("Message sent : " + info.response);
            res.render("success");
        }
    });
});

app.listen(port, () => console.log("Server listening on port " + port + "!"));