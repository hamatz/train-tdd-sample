const request = require("supertest");
const app = require("../../app");

const newUser = require("../mock-data/new-user.json");
const errUser = require("../mock-data/error-user.json");
const errUser2 = require("../mock-data/error-user2.json");
const errUser3 = require("../mock-data/error-user3.json");
const errUser4 = require('../mock-data/error-user4.json');

const endpointUrl = "/user/";

describe(endpointUrl + "signup", () => {
  test("POST " + endpointUrl + "signup", async () => {
    const response = await request(app)
      .post(endpointUrl + "signup")
      .send(newUser);
    expect(response.statusCode).toBe(201);
  });
  it(
    "should return error 500 on malformed data with POST" +
      endpointUrl +
      "signup",
    async () => {
      const response = await request(app)
        .post(endpointUrl + "signup")
        .send(errUser);
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        message: "password info should be set",
      });
    }
  );
  it(
    "should return error 500 on same e-mail address user with POST" +
      endpointUrl +
      "signup",
    async () => {
      const response = await request(app)
        .post(endpointUrl + "signup")
        .send(newUser);
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        message:
          "User validation failed: email: Error, expected `email` to be unique. Value: `testman@test.com`",
      });
    }
  );
  it(
    "should return error 500  on malformed data (no email address) with POST" +
      endpointUrl +
      "signup",
    async () => {
      const response = await request(app)
        .post(endpointUrl + "signup")
        .send(errUser2);
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        message: "User validation failed: email: Path `email` is required.",
      });
    }
  );
  
  it(
    "should return error 500  on too weak password with POST" +
      endpointUrl +
      "signup",
    async () => {
      const response = await request(app)
        .post(endpointUrl + "signup")
        .send(errUser4);
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        message: 'Passowrd is too weak.',
      });
    }
  );
  });

describe(endpointUrl + "login", () => {
  test("POST " + endpointUrl + "login", async () => {
    const response = await request(app)
      .post(endpointUrl + "login")
      .send(newUser);
    expect(response.statusCode).toBe(200);
  });
  it(
    "should return error 404 on wrong password with POST" +
      endpointUrl +
      "login",
    async () => {
      const response = await request(app)
        .post(endpointUrl + "login")
        .send(errUser3);
      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({
        message: "Not Found Error",
      });
    }
  );
});
