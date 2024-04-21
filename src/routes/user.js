"use strict";
/* -------------------------------------------------------
    USER ROUTER
------------------------------------------------------- */
const router = require("express").Router();
const user = require("../controllers/user");
const permissions = require("../middlewares/permissions");
/* ------------------------------------------------------- */
// URL: /users

router.route("/").get(permissions.isStaff, user.list).post(user.create);

router
  .route("/:id")
  .get(permissions.isLogin, user.read)
  .put(permissions.isLogin, user.update)
  .patch(permissions.isLogin, user.update)
  .delete(permissions.isAdmin, user.delete);

/* ------------------------------------------------------- */
module.exports = router;
