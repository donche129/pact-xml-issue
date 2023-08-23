import { Verifier } from "@pact-foundation/pact";

import express from "express";

// Provider code
const server = express();
server.use((_: any, res: any, next: () => void): void => {
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});

server.get("/", (_: any, res: any) => {
  res.json({
    foo: "1",  // -> should pass ✅
    // foo: 1, // -> should fail ❌
  });
});

const app = server.listen(8080, () => {
  console.log("API listening on http://localhost:8080");
});

// Verification code
describe("Pact Provider Verification", () => {
  const pact = new Verifier({
    pactUrls: ["./pacts/myconsumer-myprovider.json"],
    providerBaseUrl: "http://127.0.0.1:8080",
  });

  it("verifies the pact", () => {
    return pact.verifyProvider();
  });

  afterAll(() => {
    app.close();
  });
});
