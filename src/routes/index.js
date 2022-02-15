const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const { signUp, signIn, getAllUsers } = require("../controllers/user");
router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/users", auth, getAllUsers);

const { addShopping, getAllShopping, getShopping, updateShopping,deleteShopping } = require("../controllers/shopping");
router.post("/shopping", addShopping);
router.get("/shopping", auth, getAllShopping);
router.get("/shopping/:id", auth, getShopping);
router.patch("/shopping/:id", auth, updateShopping);
router.delete("/shopping/:id", auth, deleteShopping);

module.exports = router;

