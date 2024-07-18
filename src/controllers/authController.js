const { JWT_TOKEN } = require('../constant/authConstant');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

exports.register = (req, res) => {
    const { username, email, password } = req.body;

    console.log(req.body);  // Tambahkan log ini untuk debugging

    if (!username || !email || !password) {
        return res.status(400).send({ message: "Content can not be empty!" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    User.create(newUser, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        } else {
            const token = jwt.sign({ id: data.id }, JWT_TOKEN, { expiresIn: '24h' });
            res.send({ auth: true, token: token });
        }
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    // console.log(req.body);  // Tambahkan log ini untuk debugging

    if (!email || !password) {
        return res.status(400).send({ message: "Content can not be empty!" });
    }

    User.findByEmail(email, (err, user) => {
        if (err || !user) {
            return res.status(404).send({ message: "User Not found." });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({
                auth: false,
                token: null,
                message: "Invalid Password!"
            });
        }

        const token = jwt.sign({ id: user.id }, JWT_TOKEN, { expiresIn: '24h' });

        res.status(200).send({ auth: true, 
            id : user.id,
            username : user.username,
            email : user.email,
            token: token 
        });
    });
};

exports.getProfile = (req, res) => {
    User.findById(req.userId, (err, user) => {
        if (err) {
            return res.status(500).send({ message: "Error retrieving user information." });
        }
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        res.status(200).send(user);
    });
};
