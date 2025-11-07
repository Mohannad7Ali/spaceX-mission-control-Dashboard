const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const { loadPlanets } = require("../../models/planets.model");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanets();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });
  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect(200)
        .expect("Content-Type", /json/);
    });
  });
  describe("Test POST /launches", () => {
    const data = {
      mission: "Kepler-442 f",
      rocket: "Explorer IS1",
      target: "Kepler-442 b",
      launchDate: "March 5, 2022",
    };
    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(data)
        .expect(201)
        .expect("Content-Type", /json/);
      const requestDate = new Date(data.launchDate).valueOf();
      const responseDate = new Date(response.body.data.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
    });
    test("it should be catch missing property", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({
          mission: "Kepler-442 f",
          rocket: "Explorer IS1",
          target: "Kepler-442 b",
        })
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body).toStrictEqual({
        error: "missing required launch property",
      });
    });
    test("it should be catch error date", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({
          mission: "Kepler-442 f",
          rocket: "Explorer IS1",
          target: "Kepler-442 b",
          launchDate: "hello",
        })
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body).toStrictEqual({ error: "Invalid Date" });
    });
  });
});
