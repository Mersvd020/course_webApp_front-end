const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");
const { spawn, execFileSync } = require("node:child_process");
const { once } = require("node:events");

async function listen(server) {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return server.address().port;
}

async function main() {
  // Only this local fixture receives the synthetic credentials below.
  const upstream = http.createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    response.writeHead(request.url.startsWith("/user/rejected") ? 401 : 200, {
      "Content-Type": "application/json",
    });
    response.end(
      JSON.stringify({
        method: request.method,
        url: request.url,
        body,
        authorization: request.headers.authorization,
        device: request.headers["x-device-id"],
      }),
    );
  });
  let child;
  try {
    const upstreamPort = await listen(upstream);
    const reservation = http.createServer();
    const frontendPort = await listen(reservation);
    await new Promise((resolve) => reservation.close(resolve));
    child = spawn(
      process.execPath,
      [
        require.resolve("next/dist/bin/next"),
        "dev",
        "--hostname",
        "127.0.0.1",
        "--port",
        String(frontendPort),
      ],
      {
        cwd: path.resolve(__dirname, ".."),
        env: { ...process.env, API_URL: `http://127.0.0.1:${upstreamPort}` },
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
      },
    );
    let logs = "";
    child.stdout.on("data", (chunk) => {
      logs = (logs + chunk).slice(-8000);
    });
    child.stderr.on("data", (chunk) => {
      logs = (logs + chunk).slice(-8000);
    });
    const base = `http://127.0.0.1:${frontendPort}/api/backend`;
    const deadline = Date.now() + 45000;
    let ready = false;
    while (Date.now() < deadline && child.exitCode === null) {
      try {
        const response = await fetch(`${base}/health`, {
          signal: AbortSignal.timeout(1000),
        });
        if (response.ok && (await response.json()).url === "/health") {
          ready = true;
          break;
        }
      } catch {
        /* Wait for this test's Next.js process to become ready. */
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    assert.ok(ready, `Proxy did not start: ${logs}`);
    const payload = JSON.stringify({
      email: "test@example.invalid",
      password: "synthetic-test-only",
    });
    const login = await fetch(`${base}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
        "x-device-id": "test-device",
      },
      body: payload,
    });
    assert.equal(login.status, 200);
    assert.deepEqual(await login.json(), {
      method: "POST",
      url: "/user/login",
      body: payload,
      authorization: "Bearer test-token",
      device: "test-device",
    });
    console.log("PASS proxy preserves POST body, authorization and device ID");

    const catalog = await fetch(
      `${base}/course/getAllCourseWithPagination?search=React&page=2&limit=10`,
    );
    const forwarded = new URL((await catalog.json()).url, "http://fixture");
    assert.equal(forwarded.pathname, "/course/getAllCourseWithPagination");
    assert.equal(forwarded.searchParams.get("search"), "React");
    assert.equal(forwarded.searchParams.get("page"), "2");
    assert.equal(forwarded.searchParams.get("limit"), "10");
    console.log("PASS proxy preserves GET paths and query parameters");
    const rejected = await fetch(`${base}/user/rejected`);
    assert.equal(rejected.status, 401);
    assert.equal((await rejected.json()).url, "/user/rejected");
    console.log("PASS proxy preserves upstream error status and response body");
  } finally {
    // Stop only the process tree created by this test; leave user servers alone.
    if (child && child.exitCode === null) {
      if (process.platform === "win32") {
        execFileSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
          stdio: "ignore",
          windowsHide: true,
        });
      } else child.kill("SIGTERM");
    }
    upstream.closeAllConnections();
    await new Promise((resolve) => upstream.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
