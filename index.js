const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path"); 
const port = process.env.Port || 3000;

dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose.connect(process.env.MONGO_URL)
.then(console.log("Connected to mongodb"))
.catch(err => console.log(err));


//Using multer for serving the images
const storage = multer.diskStorage({
      destination: (req, file, cb) => {
            cb(null, "images");
      },
      filename: (req, file, cb) => {
            cb(null, req.body.name);
      }
});

const upload = multer({storage: storage});
app.post("/api/upload", upload.single("file"), (req, res) => {
      res.status(200).json("File has been uploaded.");
});

app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, upload");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      next();
    });


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(port, () => {
      console.log(`Server is running on ${port}`);
})

