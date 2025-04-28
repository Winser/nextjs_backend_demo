import * as bcrypt from "bcryptjs";
import HttpException from "../../models/http-exception.model";
import { RegisterInput } from "./register-input.model";
import prisma from "../../prisma/prisma";
import generateToken from "./token.utils";

export const createUser = async (registerInput: RegisterInput) => {
    const login = registerInput.login?.trim();
    const email = registerInput.email?.trim();
    const password = registerInput.password?.trim();

    if (!login) {
        throw new HttpException(400, {errors: {login: ["can't be blank"]}});
    }

    if (!email) {
        throw new HttpException(400, {errors: {email: ["can't be blank"]}});
    }

    if (!password) {
        throw new HttpException(400, {errors: {password: ["can't be blank"]}});
    }

    await checkUserUnique(login, email);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            username: login,
            email: email,
            password: hashedPassword,
        }
    })

    return {
        user: user,
        token: generateToken(user.id),
    }
}

const checkUserUnique = async (login: string, email: string) => {
    const emailExistsPromice = prisma.user.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
        }
    });

    const loginExistsPromice = prisma.user.findUnique({
        where: {
            username: login,
        },
        select: {
            id: true,
        }
    });

    const [emailExists, loginExists] = await Promise.all([emailExistsPromice, loginExistsPromice]);
    if (emailExists) {
        throw new HttpException(400, "Email already exists");
    }

    if (loginExists) {
        throw new HttpException(400, "Login already exists");
    }
}