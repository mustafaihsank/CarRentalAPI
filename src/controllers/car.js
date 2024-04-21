"use strict";
/* -------------------------------------------------------
    CAR CONTROLLER
------------------------------------------------------- */
// Car Controller:

const Car = require("../models/car");
const Reservation = require("../models/reservation");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Cars"]
      #swagger.summary = "List Cars"
      #swagger.description = `
        You can send query with endpoint for search[], sort[], page and limit.
        <ul> Examples:
            <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
            <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
            <li>URL/?<b>page=2&limit=1</b></li>
        </ul>
      `
    */

    // List by date
    let reservedCars;
    const { startDate, endDate } = req.query;
    if (startDate && endDate) {
      reservedCars = await Reservation.find(
        {
          $nor: [
            { startDate: { $gt: endDate } }, // gt: >
            { endDate: { $lt: startDate } }, // lt: <
          ],
        },
        { _id: 0, carId: 1 }
      ).distinct("carId");
    } else {
      throw new Error("startDate and endDate queries are required.");
    }

    const customFilter = {
      _id: { $nin: reservedCars },
      isAvailable: true,
    };
    const data = await res.getModelList(Car, customFilter, [
      { path: "createdId", select: "username" }, // Populate for createdId
      { path: "updatedId", select: "username" }, // Populate for updatedId
    ]);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Car, customFilter),
      data,
    });
  },

  create: async (req, res) => {
    /*
      #swagger.tags = ["Cars"]
      #swagger.summary = "Create Car"
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              "$ref": "#/definitions/Car"
          }
      }
    */

    req.body.createdId = req.user._id;
    req.body.updatedId = req.user._id;
    const data = await Car.create(req.body);

    res.status(201).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    /*
      #swagger.tags = ["Cars"]
      #swagger.summary = "Get Single Car"
    */

    //? Yetkisiz kullanıcının başka bir kullanıcıyı yönetmesini engelle (sadece kendi verileri):
    // if (!req.user.isAdmin) {
    //     req.params.id = req.user.id
    // }
    // const data = await Car.findOne({ _id: req.params.id })

    //? Yetkisiz kullanıcının başka bir kullanıcıyı yönetmesini engelle (sadece kendi verileri):
    const id = req.user.isAdmin ? req.params.id : req.user.id;
    const data = await Car.findOne({ _id: id }).populate([
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
      #swagger.tags = ["Cars"]
      #swagger.summary = "Update Car"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          "$ref": "#/definitions/Car"
        }
        }
    */

    //? Yetkisiz kullanıcının başka bir kullanıcıyı yönetmesini engelle (sadece kendi verileri):
    req.body.updatedId = req.user._id;
    if (!req.user.isAdmin) req.params.id = req.user._id;
    const data = await Car.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      data,
      new: await Car.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    /*
      #swagger.tags = ["Cars"]
      #swagger.summary = "Delete Car"
    */

    const data = await Car.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
