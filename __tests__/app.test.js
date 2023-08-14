const db = require("../db/connection");
const app = require("../app");
const data = require("../db/data/test-data");
const req = require("supertest");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/", () => {
  test("GET:200 sends an object describing all available endpoints ", () => {
    return req(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ endpoints });
      });
  });
});

describe("/topic", () => {
  test("GET:200 sends an array of the topics to the end point ", () => {
    return req(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          topic: [
            { slug: "mitch", description: "The man, the Mitch, the legend" },
            { slug: "cats", description: "Not dogs" },
            { slug: "paper", description: "what books are made of" },
          ],
        });
      });
  });
});
