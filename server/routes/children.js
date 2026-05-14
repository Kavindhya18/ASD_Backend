const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Child = require('../models/Child');

// @route   GET api/children
// @desc    Get all children for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const children = await Child.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(children);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/children
// @desc    Add a new child
// @access  Private
router.post('/', auth, async (req, res) => {
    const { 
        name, age, sex, ethnicity, country, jaundice, familyASD,
        speechDelay, learningDisorder, geneticDisorders, depression, 
        iddd, socialBehavioralIssues, anxiety 
    } = req.body;

    // Check for required fields
    if (!name || age === undefined || sex === undefined) {
        return res.status(400).json({ message: 'Please provide required child details' });
    }

    try {
        const newChild = new Child({
            user: req.user.id,
            name,
            age: Number(age),
            sex: Number(sex),
            ethnicity: ethnicity !== undefined ? Number(ethnicity) : null,
            country: country !== undefined ? Number(country) : null,
            jaundice: jaundice !== undefined ? Number(jaundice) : null,
            familyASD: familyASD !== undefined ? Number(familyASD) : null,
            speechDelay: speechDelay !== undefined ? Number(speechDelay) : 0,
            learningDisorder: learningDisorder !== undefined ? Number(learningDisorder) : 0,
            geneticDisorders: geneticDisorders !== undefined ? Number(geneticDisorders) : 0,
            depression: depression !== undefined ? Number(depression) : 0,
            iddd: iddd !== undefined ? Number(iddd) : 0,
            socialBehavioralIssues: socialBehavioralIssues !== undefined ? Number(socialBehavioralIssues) : 0,
            anxiety: anxiety !== undefined ? Number(anxiety) : 0,
            results: []
        });

        const child = await newChild.save();
        res.json(child);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/children/:id
// @desc    Delete a child
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const child = await Child.findById(req.params.id);
        
        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }

        // Check if user owns the child record
        if (child.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await child.deleteOne();
        res.json({ message: 'Child deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
