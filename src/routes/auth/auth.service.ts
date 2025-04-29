import * as bcrypt from "bcryptjs";
import HttpException from "../../models/http-exception.model";
import { RegisterInput } from "./register-input.model";
import prisma from "../../prisma/prisma";
import generateToken from "./token.utils";
import { LoginInput } from "./login-input.nmodel";

export const createUser = async (registerInput: RegisterInput) => {
    const username = registerInput.username.trim();
    const email = registerInput.email.trim();
    const password = registerInput.password.trim();

    await checkUserUnique(username, email);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hashedPassword,
        }
    })

    return {
        user: user,
        token: generateToken(user.id),
    }
}

export const login = async (loginInput: LoginInput) => {
    const username = loginInput.username?.trim();
    const email = loginInput.email?.trim();
    const password = loginInput.password.trim();

    const user = await prisma.user.findUnique({
        where: email ? { email } : { username },
    });

    if (user) {
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            return generateToken(user.id);
        }
    }

    throw new HttpException(403, {
        errors: {
            'email or password': ['is invalid'],
        },
    });
};

const checkUserUnique = async (username: string, email: string) => {
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
            username: username,
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