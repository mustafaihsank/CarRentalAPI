"use strict";
/* -------------------------------------------------------
    PERMISSIONS
------------------------------------------------------- */
// Middleware: permissions

module.exports = {
  isLogin: (req, res, next) => {
    // return next();
    if (req.user && req.user.isActive) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must login.");
    }
  },
  isAdmin: (req, res, next) => {
    // return next();
    if (req.user && req.user.isActive && req.user.isAdmin) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must login and to be Admin.");
    }
  },
  isStaff: (req, res, next) => {
    // return next();
    if (
      req.user &&
      req.user.isActive &&
      (req.user.isAdmin || req.user.isStaff)
    ) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must login and to be Admin.");
    }
  },
};
