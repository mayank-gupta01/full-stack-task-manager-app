const { Router } = require("express");
const {
  registerUser,
  logoutUser,
  loginUser,
} = require("../controllers/user.controller.js");
const upload = require("../middlewares/multer.middleware.js");
const verifyJWT = require("../middlewares/auth.middleware.js");

const router = Router();

router.route("/signup").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").get(verifyJWT, logoutUser);

module.exports = router;
