const { shopping } = require("../../models");

exports.addShopping = async (req, res) => {
    try {
        const data = await shopping.create(req.body);
        res.send({
            status: "success...",
            data
        });
        } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getAllShopping = async (req, res) => {
    try {
        const data = await shopping.findAll({ 
            attributes: { exclude: [ "createdAt", "updatedAt"] } 
        });
        res.status(200).send({
            status: "success",
            data
        });
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};

exports.getShopping = async (req, res) => {
    try {
        const { id } = req.params;
    
        const data = await shopping.findOne({
            where: {
                id,
            },
            attributes: {
            exclude: [ "id", "createdAt", "updatedAt"],
            },
        });
    
        res.send({
            status: "success",
            data
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.updateShopping = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        await shopping.update(body, { where: { id } });
        const data = await shopping.findOne({
            where: { id },
            attributes: { exclude: [ "updatedAt"] },
        });
        res.status(200).send({
            status: "success",
            data
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};

exports.deleteShopping = async (req, res) => {
    try {
        const { id } = req.params;
        await shopping.destroy({ where: { id } });
        res.status(200).send({
            status: "Success",
            data: id,
        });
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};