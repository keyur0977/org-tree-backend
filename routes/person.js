const express = require("express");
const router = express.Router();
const Person = require("../models/Person");

//list of persons
router.get("/persons", async (req, res) => {
  try {
    const persons = await Person.find().populate("parent", "name");
    res.status(200).json({
      statusCode: 200,
      message: "Persons retrieved successfully.",
      data: persons,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "An internal error occurred while retrieving the persons.",
      error: err.message,
    });
  }
});

//single person
router.get("/person/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const person = await Person.findById(id).populate("parent", "name");
    if (!person) {
      return res.status(404).json({
        statusCode: 404,
        message: "Person not found.",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "Person retrieved successfully.",
      data: person,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "An internal server error occurred while retrieving the person.",
      error: err.message,
    });
  }
});

// add a person
router.post("/add-person", async (req, res) => {
  try {
    const { name, parent } = req.body;

    if (!name)
      return res
        .status(400)
        .json({ statusCode: 400, error: "Name is required" });

    if (parent) {
      const parentPerson = await Person.findById(parent);

      if (!parentPerson) {
        return res.status(404).json({
          statusCode: 404,
          message: "Parent person not found.",
        });
      }
    }
    const newPerson = new Person({ name, parent });
    await newPerson.save();
    res.status(201).json({
      statusCode: 201,
      message: "Person added successfully.",
      data: newPerson,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "An internal server error occurred while adding the person.",
      error: err.message,
    });
  }
});

// update a person
router.put("/update-person/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent } = req.body;
    if (parent) {
      const personExists = await Person.findById(parent);
      if (!personExists) {
        return res.status(404).json({
          statusCode: 404,
          message: "Parent person not found.",
        });
      }
    }
    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      { name, parent },
      { new: true, runValidators: true }
    );
    if (!updatedPerson) {
      return res.status(404).json({
        statusCode: 404,
        message: "Person not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "Person updated successfully",
      data: updatedPerson,
    });
  } catch (err) {
    res.status(400).json({
      statusCode: 400,
      message: err.message,
    });
  }
});

// delete a person
router.delete("/remove-person/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPerson = await Person.findByIdAndDelete(id);

    if (!deletedPerson) {
      return res.status(404).json({
        statusCode: 404,
        message: "Person not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Person deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "An error occurred while deleting the person.",
      error: err.message,
    });
  }
});

module.exports = router;
