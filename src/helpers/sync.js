"use strict";
/* -------------------------------------------------------
    SYNC
------------------------------------------------------- */
// sync():

module.exports = async function () {
  return null;

  /* REMOVE DATABASE */
  const { mongoose } = require("../configs/dbConnection");
  await mongoose.connection.dropDatabase();
  console.log("- DATABASE AND ALL DATA DELETED!");
  /* REMOVE DATABASE */

  /* CREATE ADMIN */
  const User = require("../models/user");
  await User.create({
    username: "admin",
    password: "aA?123456",
    email: "admin@site.com",
    firstName: "admin",
    lastName: "admin",
    isActive: true,
    isStaff: true,
    isAdmin: true,
  });
  console.log("- ADMIN CREATED!");
  /* CREATE ADMIN */
};
