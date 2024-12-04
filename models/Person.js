const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const personSchema = new mongoose.Schema({
  uuid: { type: String, default: uuidv4 },
  name: { type: String, required: [true, "Name is required"] },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    default: null,
  },
});

module.exports = mongoose.model("Person", personSchema);
