const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');
var fetchUser = require('../middleware/fetchUser');

//ROUTE-1 : Get all notes using: GET "api/notes/fetchallnotes". Login Required
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server occured");
    }
});

//ROUTE-2 : Add a new note using: POST "api/notes/addnote". Login Required
router.post('/addnote', fetchUser, [
    body('title', "Enter a valid title i.e. 3 characters!").isLength({ min: 3 }),
    body('description', "Description must be at least 6 characters").isLength({ min: 6 }),
], async (req, res) => {

    try {

        const { title, description, tag } = req.body;

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })

        const savedNote = await note.save()

        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server occured");
    }
});

//ROUTE-3 : Update a existing note using: POST "api/notes/updatenote". Login Required
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body
    
    try {
        //Create a new_Note object
        const newNote = {};
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }
        if (tag) {
            newNote.tag = tag;
        }

        //Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found")
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed!")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server occured");
    }
});


//ROUTE-4 : Delete an existing note using: DELETE "api/notes/deletenote". Login Required
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        //Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found")
        }

        //Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed!")
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted ", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server occured");
    }
});


module.exports = router
