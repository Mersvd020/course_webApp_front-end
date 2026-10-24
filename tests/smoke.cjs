const assert = require("node:assert/strict");

// Run against an already-running local server; no authentication or payment requests.
const base = process.argv[2] ?? "http://localhost:3000";
const routes = [
  "/",
  "/course",
  "/course/mock-react",
  "/cart",
  "/user/login",
  "/user/register",
  "/user/forget-password",
  "/user/reset-password",
  "/user/courses",
  "/user/wishlist",
  "/missing-page",
];

async function main() {
  for (const route of routes) {
    const response = await fetch(new URL(route, base), {
      signal: AbortSignal.timeout(30000),
    });
    const html = await response.text();
    assert.equal(response.status, route === "/missing-page" ? 404 : 200, route);
    assert.match(html, /dir=["']rtl["']/);
    assert.match(html, /lang=["']fa["']/);
    console.log(`PASS ${response.status} ${route}`);
  }
  for (const name of ["login", "register", "forget-password"]) {
    const response = await fetch(new URL(`/${name}`, base), {
      redirect: "manual",
    });
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), `/user/${name}`);
    console.log(`PASS redirect /${name}`);
  }
  const cover = await fetch(new URL("/courses/react.svg", base));
  assert.equal(cover.status, 200);
  assert.match(cover.headers.get("content-type"), /image\/svg\+xml/);
  console.log("PASS local course artwork");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
