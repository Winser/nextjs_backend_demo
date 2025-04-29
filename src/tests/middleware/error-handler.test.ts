import { errorHandler } from "../../middleware/error-handler";
import { Request, Response, NextFunction } from "express";
import HttpException from "../../models/http-exception.model";

describe("errorHandler middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it("should handle HttpException and return the correct status and message", () => {
    const error = new HttpException(404, "Not Found");

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith("Not Found");
  });

  it("should handle generic errors and return status 500 with the error message", () => {
    const error = new Error("Internal Server Error");

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith("Internal Server Error");
  });

  it("should not call next function", () => {
    const error = new Error("Some error");

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
  });
});