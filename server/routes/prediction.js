const express = require('express');
const axios = require('axios');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Child = require('../models/Child');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Helper to create summary from features
const createSummary = (features) => {
    // Advanced (23 features)
    if (features.length === 23) {
        return {
            type: 'Advanced Clinical',
            age: features[10],
            sex: features[18] === 1 ? 'Male' : 'Female',
            clinical_history: {
                speechDelay: features[11] === 1,
                learningDisorder: features[12] === 1,
                geneticDisorders: features[13] === 1,
                depression: features[14] === 1,
                iddd: features[15] === 1,
                socialBehavioralIssues: features[16] === 1,
                anxiety: features[17] === 1,
                jaundice: features[20] === 1,
                familyASD: features[21] === 1
            },
            behavioral_score: features.slice(0, 10).reduce((a, b) => a + b, 0)
        };
    }
    // Basic (18 features)
    if (features.length === 18) {
        return {
            type: 'Basic Screening',
            age: features[10],
            sex: features[11] === 1 ? 'Male' : 'Female',
            clinical_history: {
                jaundice: features[13] === 1,
                familyASD: features[14] === 1,
            },
            behavioral_score: features.slice(0, 10).reduce((a, b) => a + b, 0)
        };
    }
    return { type: 'Unknown', data: features };
};

// Route for the new 18-feature assessment
router.post('/assess/asd_18', auth, async (req, res) => {
    try {
        const { features, childId } = req.body;
        const response = await axios.post(`${AI_SERVICE_URL}/predict/asd_18`, { features });
        
        const predictionResult = response.data;

        if (childId) {
            const childArr = await Child.find({ _id: childId, user: req.user.id });
            if (childArr.length > 0) {
                const child = childArr[0];
                child.results.push({
                    prediction: predictionResult.result,
                    probability: predictionResult.probability,
                    features: createSummary(features),
                    date: new Date()
                });
                await child.save();
            }
        }

        res.json(predictionResult);
    } catch (err) {
        console.error('18-Feature API Error:', err.message);
        res.status(500).json({ message: 'AI Service Error', error: err.message });
    }
});

// Route for the Advanced clinical form (Original endpoint)
router.post('/assess', auth, async (req, res) => {
    try {
        const { features, childId } = req.body;
        const response = await axios.post(`${AI_SERVICE_URL}/predict`, { features });
        
        const predictionResult = response.data;

        if (childId) {
            const childArr = await Child.find({ _id: childId, user: req.user.id });
            if (childArr.length > 0) {
                const child = childArr[0];
                child.results.push({
                    prediction: predictionResult.result,
                    probability: predictionResult.probability,
                    features: createSummary(features),
                    date: new Date()
                });
                await child.save();
            }
        }

        res.json(predictionResult);
    } catch (err) {
        console.error('Advanced API Error:', err.message);
        res.status(500).json({ message: 'AI Service Error', error: err.message });
    }
});

module.exports = router;
