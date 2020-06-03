const CheckAuthMiddleware = require("../../middleware/check-auth.mw");
const httpMocks = require("node-mocks-http");

const jwt = require("jsonwebtoken");

jwt.verify = jest.fn();
const mockUser = require('../mock-data/new-user2.json');

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("UserController.create", () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RkYXlvMkB0ZXN0LmNvbSIsInVzZXJJZCI6IjVlZDI2MGI3YWIwMDYzNTI5MDYyMjgzNCIsImlhdCI6MTU5MDg0NTY1NCwiZXhwIjoxNTkwODgxNjU0fQ.5g-rzz2faBT8f1Md2FEGlrLRLSpuCjYVswoFR004Fj8";
    beforeEach(() => {
      req.headers.authorization = "Bearer " + token;
    });
  
    it("should Call jwt.verify",  async () => {
      await CheckAuthMiddleware(req, res, next);
      expect(jwt.verify).toBeCalledWith(token, process.env.JWT_KEY);
    });
    it("should decode userinfo and call next", async () => {
        jwt.verify.mockReturnValue(mockUser);
        await CheckAuthMiddleware(req, res, next);
        expect(next).toBeCalled();
    });
});