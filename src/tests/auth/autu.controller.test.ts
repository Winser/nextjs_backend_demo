import request from "supertest";
import express from "express";
import authController from "../../routes/auth/auth.controller";
import { createUser, login } from "../../routes/auth/auth.service";
import HttpException from "../../models/http-exception.model";
import bodyParser from "body-parser";
import { errorHandler } from "../../middleware/error-handler";

jest.mock("../../routes/auth/auth.service", () => ({
  createUser: jest.fn(),
  login: jest.fn(),
}));

const app = express();
app.use(bodyParser.json());
app.use(authController);
app.use(errorHandler);

describe("authController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("should return 400 if user is missing in the request body", async () => {
      const response = await request(app).post("/register").send({});
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: { user: ["can't be blank"] },
      });
    });

    it("should return 201 and the created user if the request is valid", async () => {
      const mockUser = {
        user: { id: 1, username: "testuser", email: "test@example.com" },
        token: "mockToken",
      };
      (createUser as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/register")
        .send({ user: { username: "testuser", email: "test@example.com", password: "password123" } });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
      expect(createUser).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should handle errors thrown by createUser", async () => {
      (createUser as jest.Mock).mockRejectedValue(new HttpException(500, "Internal Server Error"));

      const response = await request(app)
        .post("/register")
        .send({ user: { username: "testuser", email: "test@example.com", password: "password123" } });

      expect(response.status).toBe(500);
    });
  });

  describe("POST /login", () => {
    it("should return 400 if user is missing in the request body", async () => {
      const response = await request(app).post("/login").send({});
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: { user: ["can't be blank"] },
      });
    });

    it("should return 200 and the logged-in user if the request is valid", async () => {
      const mockUser = {
        user: { id: 1, username: "testuser", email: "test@example.com" },
        token: "mockToken",
      };
      (login as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/login")
        .send({ user: { email: "test@example.com", password: "password123" } });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should return 403 if login fails", async () => {
      (login as jest.Mock).mockRejectedValue(new HttpException(403, {
        errors: {
          'email or password': ['is invalid'],
        },
      }));

      const response = await request(app)
        .post("/login")
        .send({ user: { email: "test@example.com", password: "password123" } });

      expect(response.status).toBe(403);
    });
  });
});