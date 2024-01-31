require("dotenv").config();
const connectDB = require("./db/index.js");
const app = require("./app.js");
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("error : ", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB Connection failed", err);
  });

