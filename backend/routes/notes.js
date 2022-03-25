const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//*ROUTE 1 :Get All the Notes of a user using :  GET "/api/notes/fetchallnotes" . Login required .(HERE ALL NOTES ARE FETCHED ROUTE 1 WHICH ARE CREATED BY ROUTE 2)
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .send("Internal server error occured during fetching all notes");
  }
});

//*ROUTE 2 :Add a new Note using :  POST "/api/notes/addnote" .Login required
router.post(
  "/addnote",
  fetchuser,
  [
    //validation layer during registration
    body("title", "Enter a Valid Title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //if there are errors return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured during adding note");
    }
  }
);

//*ROUTE 3 :Update a Existiing Note using :  PUT "/api/notes/updatenote" .Login required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    //Create a newNote Object where new updating can be made
    const newNote = {};
    if (title) {
      //if we are getting title from user , then we will add it to newNote object , if not getting title it means user dont want to update note
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //First find the note to be updated and then update it
    var note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send(" Requested Note not found");
    }
    if (note.user.toString() !== req.user.id) {
      //note.user.toString() gives the id of requetsed note only
      //note.user.toString() means the existing user who is currently accesing the notes
      //Means allow updating to loggedin user if only he owns this note
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    //$set is  only way to set the value of a parameterized property
    res.json({ note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured during updating note");
  }
});

//*ROUTE 4 :Delete a Existing Note using :  DELETE "/api/notes/deletenote" .Login required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  
  // First find the note to be deleted and then delete it
  try {
    var note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send(" Requested Note not found"); //Usually used when trying to delete a note which its already deleted
    }

    if (note.user.toString() !== req.user.id) {
      //note.user.toString() gives the id of requetsed note only
      //Means if logged in user is trying to access notes of another user
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "This Note has been deleted", note: note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured during deleting note");
  }
});

module.exports = router;
