const express = require('express');
const fetchuser = require('../Middlewares/fetchuser');
const Notes = require('../Models/Note');
const { body, validationResult } = require('express-validator');

const router = express.Router();


//Route 1: Showing all notes /api/notes/allNotes   login required here       

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some internal server error occurerd")
    }
})


//Route 2: ADD Notes POST:"/api/notes/addnotes"   login required here       
router.post('/addnote', fetchuser,
    [body('title', 'Enter a valid Title').isLength({ min: 3 }),
    body('description', 'Description length should be greater than 5 characters').isLength({ min: 5 }),],
    async (req, res) => {

        try {
            const { title, description, tag } = req.body;

        // if error occurs return status and error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Notes({
                title, description, tag, user: req.user.id
            })

            const savednotes = await note.save()

            res.send(savednotes)

        } catch (error) {
            console.error(error.message)
            res.status(500).send("Some internal server error occurerd")
        }
    })

//Route 3: Update Notes PUT:"/api/notes/updatenote"   login required here       
router.put('/updatenote/:id', fetchuser,
    async (req, res) => {
        const { title, description, tag } = req.body;
        try {
            
            //Create a new note and then repalce it
            const newnote = {};

            if (title) { newnote.title = title }
            if (description) { newnote.description = description }
            if (tag) { newnote.tag = tag }

            //Find the note and then update it

            let note = await Notes.findById(req.params.id);
            if (!note) { return res.status(404).send("Not Found") }

            if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed") }

            note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true })
            res.json({ note });

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

    
//Route 4: Delete Notes DELETE:"/api/notes/deletenote"   login required here       
router.delete('/deletenote/:id', fetchuser,
    async (req, res) => {
        try {

            //Find the note and then delete it

            let note = await Notes.findById(req.params.id);
            if (!note) { return res.status(404).send("Not Found") }
            // Allow deletion only if user owns this Note
            if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed") };

            note = await Notes.findByIdAndDelete(req.params.id)
            res.json({"Success " :"Successfully deleted" , note:note });

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

module.exports = router