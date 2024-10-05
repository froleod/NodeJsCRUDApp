// developed by Leonid Frolov

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create a new contact
router.post('/', async (req, res) => {
    const {name, phone, email} = req.body;
    try {
        const newContact = await pool.query(
            'INSERT INTO contacts (name, phone, email) VALUES ($1, $2, $3) RETURNING *',
            [name, phone, email]
        );
        res.status(201).json(newContact.rows[0]);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

// Read all contacts
router.get('/', async (req, res) => {
    try {
        const allContacts = await pool.query('SELECT * FROM contacts');
        res.json(allContacts.rows);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Read a contact by ID
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const contact = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);
        if (contact.rows.length === 0) {
            return res.status(404).json({error: 'Contact not found'});
        }
        res.json(contact.rows[0]);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// Update a contact
router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {name, phone, email} = req.body;

    try {
        const updatedContact = await pool.query(
            'UPDATE contacts SET name = $1, phone = $2, email = $3 WHERE id = $4 RETURNING *',
            [name, phone, email, id]
        );

        if (updatedContact.rows.length === 0) {
            return res.status(404).json({error: 'Contact not found'});
        }

        res.json(updatedContact.rows[0]);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});


// Delete a contact
router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const deletedContact = await pool.query('DELETE FROM contacts WHERE id = $1 RETURNING *', [id]);
        if (deletedContact.rows.length === 0) {
            return res.status(404).json({error: 'Contact not found'});
        }
        res.json(deletedContact.rows[0]);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;
