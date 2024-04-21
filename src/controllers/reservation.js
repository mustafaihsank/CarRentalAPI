"use strict";
/* -------------------------------------------------------
    Reservation CONTROLLER
------------------------------------------------------- */
// Reservation Controller:

const Reservation = require("../models/reservation");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Reservations"]
      #swagger.summary = "List Reservations"
      #swagger.description = `
        You can send query with endpoint for search[], sort[], page and limit.
        <ul> Examples:
          <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
          <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
          <li>URL/?<b>page=2&limit=1</b></li>
          </ul>
      `
    */

    //? Yetkisiz kullanıcının başka bir kullanıcıyı yönetmesini engelle (sadece kendi verileri):
    let customFilter;
    if (!req.user.isAdmin && !req.user.isStaff) {
      customFilter = { _id: req.user.id };
    }

    const data = await res.getModelList(Reservation, customFilter, [
      { path: "userId", select: "username firstName lastName" }, // Populate for userId
      { path: "carId" }, // Populate for userId
      { path: "createdId", select: "username" }, // Populate for createdId
      { path: "updatedId", select: "username" }, // Populate for updatedId
    ]);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Reservation, customFilter),
      data,
    });
  },

  create: async (req, res) => {
    /*
      #swagger.tags = ["Reservations"]
      #swagger.summary = "Create Reservation"
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
            "$ref": "#/definitions/Reservation"
          }
      }
    */

    if ((!req.user.isAdmin && !req.user.isStaff) || !req.body?.userId) {
      req.body.userId = req.user._id;
    }

    req.body.createdId = req.user._id;
    req.body.updatedId = req.user._id;

    const userReservationInDates = await Reservation.findOne({
      userId: req.body.userId,
      $nor: [
        { startDate: { $gt: req.body.endDate } }, // gt: >
        { endDate: { $lt: req.body.startDate } }, // lt: <
      ],
    });

    if (userReservationInDates) {
      res.errorStatusCode = 400;
      throw new Error(
        "It cannot be added because there is another reservation in this time interval.",
        { cause: { userReservationInDates } }
      );
    } else {
      const data = await Reservation.create(req.body);
      res.status(201).send({
        error: false,
        data,
      });
    }
  },

  read: async (req, res) => {
    /*
      #swagger.tags = ["Reservations"]
      #swagger.summary = "Get Single Reservation"
    */

    //? Yetkisiz kullanıcının başka bir kullanıcıyı yönetmesini engelle (sadece kendi verileri):
    let customFilter;
    if (!req.user.isAdmin && !req.user.isStaff) {
      customFilter = { userId: req.user.id };
    }

    //? Yetkisiz kullanıcının başka bir kullanıcıyı yönetmesini engelle (sadece kendi verileri):
    const id = req.user.isAdmin ? req.params.id : req.user.id;
    const data = await Reservation.findOne({
      _id: id,
      ...customFilter,
    }).populate([
      { path: "userId", select: "username firstName lastName" }, // Populate for userId
      { path: "carId" }, // Populate for userId
      { path: "createdId", select: "username" }, // Populate for createdId
      { path: "updatedId", select: "username" }, // Populate for updatedId
    ]);

    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    /*
      #swagger.tags = ["Reservations"]
      #swagger.summary = "Update Reservation"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            "$ref": "#/definitions/Reservation"
        }
      }
    */

    if (!req.user.isAdmin) {
      delete req.body.userId;
    }
    //? Yetkisiz kullanıcının başka bir kullanıcıyı yönetmesini engelle (sadece kendi verileri):
    req.body.updatedId = req.user._id;
    if (!req.user.isAdmin) req.params.id = req.user._id;
    const data = await Reservation.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      data,
      new: await Reservation.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    /*
      #swagger.tags = ["Reservations"]
      #swagger.summary = "Delete Reservation"
    */

    const data = await Reservation.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
