import * as bcrypt from "bcryptjs";
import prisma from "../../prisma/prisma";
import HttpException from "../../models/http-exception.model";
import generateToken from "../../routes/auth/token.utils";
import { createUser } from "../../routes/auth/auth.service";

// filepath: /home/winser/test/backend_demo/src/routes/auth/auth.service.test.ts

jest.mock("../../prisma/prisma", () => ({
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
}));

jest.mock("bcryptjs", () => ({
    hash: jest.fn(),
}));

jest.mock("../../../src/routes/auth/token.utils", () => jest.fn());

describe("createUser", () => {
    const mockRegisterInput = {
        login: "testuser",
        email: "test@example.com",
        password: "password123",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should throw an error if login is missing", async () => {
        const input = { ...mockRegisterInput, login: "" };
        await expect(createUser(input)).rejects.toThrow(HttpException);
    });

    it("should throw an error if email is missing", async () => {
        const input = { ...mockRegisterInput, email: "" };
        await expect(createUser(input)).rejects.toThrow(HttpException);
    });

    it("should throw an error if password is missing", async () => {
        const input = { ...mockRegisterInput, password: "" };
        await expect(createUser(input)).rejects.toThrow(HttpException);
    });

    it("should throw an error if login already exists", async () => {
        (prisma.user.findUnique as jest.Mock).mockImplementation(({ where }) => {
            if (where.username) return { id: 1 };
            return null;
        });

        await expect(createUser(mockRegisterInput)).rejects.toThrow(HttpException);
    });

    it("should throw an error if email already exists", async () => {
        (prisma.user.findUnique as jest.Mock).mockImplementation(({ where }) => {
            if (where.email) return { id: 1 };
            return null;
        });

        await expect(createUser(mockRegisterInput)).rejects.toThrow(HttpException);
    });

    it("should create a user successfully", async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
        (prisma.user.create as jest.Mock).mockResolvedValue({
            id: 1,
            username: mockRegisterInput.login,
            email: mockRegisterInput.email,
            password: "hashedPassword",
        });
        (generateToken as jest.Mock).mockReturnValue("mockToken");

        const result = await createUser(mockRegisterInput);
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                username: mockRegisterInput.login,
                email: mockRegisterInput.email,
                password: "hashedPassword",
            },
        });
        expect(result).toEqual({
            user: {
                id: 1,
                username: mockRegisterInput.login,
                email: mockRegisterInput.email,
                password: "hashedPassword",
            },
            token: "mockToken",
        });
    });
});