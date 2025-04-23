const { User } = require('../models');
const jwt = require('jsonwebtoken');

class UserController {
    static async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getUserById(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async register(req, res) {
        try {
            const { username, email, password } = req.body;
            
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const newUser = await User.create({ username, email, password });
            
            const token = jwt.sign(
                { id: newUser.id, email: newUser.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email
                },
                token
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isValid = await user.checkPassword(password);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                token
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            await user.update(req.body);
            const updatedUser = await User.findByPk(req.params.id);
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            await User.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = UserController; 