const assert = require("node:assert/strict");
const { test } = require("node:test");
const createLoader = require("./load-module.cjs");

test("API client uses a relative proxy URL and preserves authentication headers", async () => {
  global.window = {};
  global.localStorage = { getItem: () => "test-session-token" };
  try {
    const { api } = createLoader()("lib/api.ts");
    assert.equal(api.defaults.baseURL, "/api/backend");
    const requests = [];
    api.defaults.adapter = async (config) => {
      requests.push(config);
      return { data: {}, status: 200, statusText: "OK", headers: {}, config };
    };
    await api.post(
      "/user/login",
      { email: "test@example.com" },
      {
        headers: { "x-device-id": "test-device" },
      },
    );
    assert.equal(api.getUri(requests[0]), "/api/backend/user/login");
    assert.equal(
      requests[0].headers.Authorization,
      "Bearer test-session-token",
    );
    assert.equal(requests[0].headers["x-device-id"], "test-device");
    await api.post(
      "/user/step2_resetPassword",
      {},
      {
        headers: { Authorization: "Bearer test-recovery-token" },
      },
    );
    assert.equal(
      requests[1].headers.Authorization,
      "Bearer test-recovery-token",
    );
  } finally {
    delete global.window;
    delete global.localStorage;
  }
});

test("proxy destination supports server env, legacy env and default without double slashes", async () => {
  const previous = {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  };
  const config = createLoader()("next.config.ts").default;
  try {
    process.env.API_URL = "http://127.0.0.1:4567/v1/";
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001";
    assert.deepEqual(await config.rewrites(), [
      {
        source: "/api/backend/:path*",
        destination: "http://127.0.0.1:4567/v1/:path*",
      },
    ]);
    delete process.env.API_URL;
    assert.equal(
      (await config.rewrites())[0].destination,
      "http://localhost:3001/:path*",
    );
    delete process.env.NEXT_PUBLIC_API_URL;
    assert.equal(
      (await config.rewrites())[0].destination,
      "http://localhost:3001/:path*",
    );
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
