import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import {
  SpecificationVersion,
  PactV3,
  LogLevel,
  MatchersV3,
} from "@pact-foundation/pact";
import axios from "axios";

chai.use(chaiAsPromised);

const { expect } = chai;

describe("Pact Consumer Test", () => {
  const pact = new PactV3({
    consumer: "myconsumer",
    provider: "myprovider",
    spec: SpecificationVersion.SPECIFICATION_VERSION_V3,
    logLevel: (process.env.LOG_LEVEL as LogLevel) || "info",
  });

  const xmlBody = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <images>
    <sized>
      <service id="1234">
        <image lastModified="00:00:00 1 Jan 2023" placement="square:x-small">https://google.com/image1.svg</image>
        <image lastModified="00:00:00 1 Jan 2023" placement="square:small">https://google.com/imag2.svg</image>
      </service>
    </sized>
    <presentationmap>
      <service id="1234">
        <image lastModified="00:00:00 1 Jan 2023" placement="PlacementOne">https://google.com/image3.svg</image>
        <image lastModified="00:00:00 1 Jan 2023" placement="PlacementTwo">https://google.com/image4.svg</image>
      </service>
    </presentationmap>
  </images>`

  it("creates a pact to verify", async () => {
    await pact
      .addInteraction({
        uponReceiving: "a request for a foo",
        withRequest: {
          method: "GET",
          path: "/",
          headers: {
            Accept: ["application/xml", "text/xml"],
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
          },
          body: MatchersV3.like(xmlBody),
        },
      })
      .executeTest(async (mockserver) => {
        const res = await axios.request({
          baseURL: mockserver.url,
          method: "GET",
          url: "/",
          headers: {
            Accept: ["application/xml", "text/xml"],
          },
        });

        console.log({ res: res.data })

        expect(res.data).to.equal(xmlBody);
      });
  });
});
