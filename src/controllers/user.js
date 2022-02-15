const { user } = require("../../models");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
    const data = req.body;
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
        email: Joi.string().min(6).email().required(),
        phone: Joi.string().min(10).required(),
        country: Joi.string().required(),
        city: Joi.string().required(),
        postcode: Joi.string().required(),
        name: Joi.string().required(),
        address: Joi.string().required(),
    });

    const { error } = schema.validate(data);

    if (error) {
        return res.send({
            status: "error",
            message: error.details[0].message,
        });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const userExist = await user.findOne({
            where: {
            email: data.email,
            },
        });

        if (userExist) {
            return res.send({
                status: "error",
                message: "email already used",
            });
        }

        const newUser = await user.create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            phone: req.body.phone,
            country: req.body.country,
            city: req.body.city,
            postcode: req.body.postcode,
            name: req.body.name,
            address: req.body.address,
        });

        const dataToken = {
            email: newUser.email,
        };
        const token = jwt.sign(dataToken, process.env.TOKEN_API);
        res.send({
            status: "success",
            data: {
                user: {
                    email: newUser.email,
                    token,
                    username: newUser.username,
                },
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};

exports.signIn = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(5).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.send({
            status: "error",
            message: error.details[0].message,
        });
    }
    try {
        const userExist = await user.findOne({
            where: {
                email: req.body.email,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        if (!userExist) {
            return res.send({
                status: "error",
                message: "user doesn't exist",
            });
        }
        const isValid = await bcrypt.compare(req.body.password, userExist.password);

        if (!isValid) {
        return res.send({
                status: "error",
                message: "Wrong Email or Password",
            });
        }

        const dataToken = {
            id: userExist.id,
        };
        const token = jwt.sign(dataToken, process.env.TOKEN_API);

        res.status(200).send({
            status: "success",
            data: {
                user: {
                    email: userExist.email,
                    token,
                    username: userExist.username,
                },
            },
        });
    } catch (error) {
        res.status(500).send({
        status: "failed",
        message: "Server error",
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const data = await user.findAll({ attributes: { exclude: ["password", "createdAt", "updatedAt"] } });
        res.status(200).send({
            status: "success",
            data: {
                user: data,
            },
        });
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};