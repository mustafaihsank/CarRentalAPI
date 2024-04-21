"use strict";
/* -------------------------------------------------------
    RESERVATION ROUTER
------------------------------------------------------- */
const router = require("express").Router();
const reservation = require("../controllers/reservation");
const permissions = require("../middlewares/permissions");
/* ------------------------------------------------------- */
// URL: /reservations
router
  .route("/")
  .get(permissions.isLogin, reservation.list)
  .post(permissions.isLogin, reservation.create);

router
  .route("/:id")
  .get(permissions.isLogin, reservation.read)
  .put(permissions.isStaff, reservation.update)
  .patch(permissions.isStaff, reservation.update)
  .delete(permissions.isAdmin, reservation.delete);

/* ------------------------------------------------------- */
module.exports = router;