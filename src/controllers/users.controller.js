import { findAll, findById, findByEmail, deleteOne, updateRole } from "../services/users.service.js";
import { CustomError, ErrorMessages } from "../errors/error.js";


export const findUsers = async (req, res) => {
    try {
        const allUsers = await findAll();
        res.status(200).send({ message: ' All users ', allUsers })
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    }
};

export const findUserById = async (req, res) => {
    const { uid } = req.params;
    try {
        const user = await findById(uid);
        res.status(200).send({ message: ' User found ', user })
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    }
};

export const findUserByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await findByEmail(email);
        if(!user) throw CustomError.createError(ErrorMessages.USER_NOT_FOUND, ErrorMessages.ISSUE_SESSION, 404)
        res.status(200).send({ message: ' User found ', user })
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    }
};

export const deleteUser = async (req, res) => {
    const { uid } = req.params;
    try {
        const deletedUser = await deleteOne(uid);
        res.status(200).send({ message: ' User removed. ', deletedUser });
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    };
};

export const upgradeRole = async (req, res) => {
    const requser = req.user;
    try {
        const newRole = await updateRole(requser)
        res.status(200).send({ message: "User's role changed", newRole })
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    }
}