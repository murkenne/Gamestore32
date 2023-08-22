const client = require('./client');
const util = require('util');

const REPLACE_ME = 'HELP REPLACE ME!!!!';

// GET - /api/video-games - get all video games
async function getAllVideoGames() {
    try {
        const { rows: videoGames } = await client.query(`
            SELECT * FROM videoGames;
        `);
        return videoGames;
    } catch (error) {
        throw new Error("Make sure you have replaced the REPLACE_ME placeholder.")
    }
}

// GET - /api/video-games/:id - get a single video game by id
async function getVideoGameById(id) {
    try {
        const { rows: [videoGame] } = await client.query(`
            SELECT * FROM videoGames
            WHERE id = $1;
        `, [id]);
        return videoGame;
    } catch (error) {
        throw error;
    }
}

// POST - /api/video-games - create a new video game
async function createVideoGame(body) {
    try {
        const { name,description,price } = body;

        const { rows: [newVideoGame] } = await client.query(`
            INSERT INTO videoGames(name,description,price) 
            VALUES($1,$2,$3)
            RETURNING *;
        `, [name,description,price]);

        return newVideoGame;
    } catch (error) {
        throw error;
    }
}

// PUT - /api/video-games/:id - update a single video game by id
async function updateVideoGame(id, fields = {}) {
    try {
        const { name, description, price } = fields;

        // Constructing the query only if the fields are present.
        const setParts = [];
        const values = [id];

        if (name !== undefined) {
            setParts.push(`name = $${values.length + 1}`);
            values.push(name);
        }
        if (description !== undefined) {
            setParts.push(`description = $${values.length + 1}`);
            values.push(description);
        }
        if (price !== undefined) {
            setParts.push(`price = $${values.length + 1}`);
            values.push(price);
        }

        const { rows: [updatedVideoGame] } = await client.query(`
            UPDATE videoGames
            SET ${setParts.join(', ')}
            WHERE id = $1
            RETURNING *;
        `, values);

        return updatedVideoGame;
    } catch (error) {
        throw error;
    }
}


// DELETE - /api/video-games/:id - delete a single video game by id
async function deleteVideoGame(id) {
    try {
        await client.query(`
            DELETE FROM videoGames
            WHERE id = $1;
        `, [id]);

        return { message: 'Video game deleted.' };
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllVideoGames,
    getVideoGameById,
    createVideoGame,
    updateVideoGame,
    deleteVideoGame
}
