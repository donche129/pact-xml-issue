"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pact_1 = require("@pact-foundation/pact");
const express_1 = __importDefault(require("express"));
// Provider code
const server = (0, express_1.default)();
server.use((_, res, next) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
});
server.get("/", (_, res) => {
    res.json({
        foo: "1",
        // foo: 1, // -> should fail
    });
});
const app = server.listen(8080, () => {
    console.log("API listening on http://localhost:8080");
});
// Verification code
describe("Pact Provider Verification", () => {
    const pact = new pact_1.Verifier({
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
