const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
});

const Game = sequelize.define('Game', {
  player1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  player2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  winner: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

sequelize.sync();

app.get('/games', async (req, res) => {
  const games = await Game.findAll();
  res.json(games);
});

app.post('/games', async (req, res) => {
  const games = req.body;
  try {
    if (Array.isArray(games)) {
      const newGames = await Game.bulkCreate(games);
      res.json(newGames);
    } else {
      const newGame = await Game.create(games);
      res.json(newGame);
    }
  } catch (error) {
    console.error('Error saving game data:', error);
    res.status(500).json({ error: 'Failed to save game data' });
  }
});

app.put('/game/:id', async (req, res) => {
  const { id } = req.params;
  const { winner } = req.body;
  const game = await Game.findByPk(id);
  game.winner = winner;
  await game.save();
  res.json(game);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
