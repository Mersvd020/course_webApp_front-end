const assert = require("node:assert/strict");
const { test } = require("node:test");
const createLoader = require("./load-module.cjs");

test("catalog uses real API data and normalizes optional fields", async () => {
  let request;
  const load = createLoader({
    "@/lib/api": {
      api: {
        get: async (...args) => {
          request = args;
          return {
            data: {
              data: {
                courses: [
                  {
                    id: "real-1",
                    name: "Real course",
                    price: "1500",
                    teacher: { name: "Teacher" },
                  },
                ],
              },
            },
          };
        },
      },
    },
  });
  const result = await load("services/course.service.ts").getCourses();
  assert.equal(result.source, "api");
  assert.equal(result.data[0].price, 1500);
  assert.equal(result.data[0].instructor, "Teacher");
  assert.equal(result.data[0].discountedPrice, undefined);
  assert.equal(request[0], "/course/getAllCourseWithPagination");
  assert.equal(request[1].timeout, 5000);
});

test("empty, malformed and unavailable catalogs fall back to marked demo data", async () => {
  for (const response of [
    [],
    { data: [] },
    { items: [{ title: "invalid" }] },
    "not json",
    null,
  ]) {
    const load = createLoader({
      "@/lib/api": { api: { get: async () => ({ data: response }) } },
    });
    const result = await load("services/course.service.ts").getCourses();
    assert.equal(result.source, "mock");
    assert.equal(result.data.length, 6);
  }
  const load = createLoader({
    "@/lib/api": {
      api: {
        get: async () => {
          throw new Error("offline");
        },
      },
    },
  });
  assert.equal(
    (await load("services/course.service.ts").getCourses()).source,
    "mock",
  );
});

test("explicit mock mode and mock details never call the API", async () => {
  const previous = process.env.NEXT_PUBLIC_USE_MOCK_DATA;
  const load = createLoader({
    "@/lib/api": {
      api: { get: () => assert.fail("API should not be called") },
    },
  });
  const service = load("services/course.service.ts");
  try {
    process.env.NEXT_PUBLIC_USE_MOCK_DATA = "true";
    assert.equal((await service.getCourses()).source, "mock");
    assert.equal((await service.getCourse("mock-react")).data.topics.length, 3);
    assert.equal((await service.getCourse("unknown")).data, null);
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_USE_MOCK_DATA;
    else process.env.NEXT_PUBLIC_USE_MOCK_DATA = previous;
  }
});

test("real detail fetches topics and keeps a valid course when topics fail", async () => {
  let failTopics = false;
  const load = createLoader({
    "@/lib/api": {
      api: {
        get: async (url) => {
          if (url.endsWith("/topics")) {
            if (failTopics) throw new Error("offline");
            return {
              data: {
                data: [
                  {
                    id: "topic",
                    name: "Basics",
                    lessons: [{ id: "lesson", name: "Intro" }],
                  },
                ],
              },
            };
          }
          return {
            data: { data: { id: "real", title: "Course", price: 200 } },
          };
        },
      },
    },
  });
  const service = load("services/course.service.ts");
  assert.equal(
    (await service.getCourse("real")).data.topics[0].lessons[0].title,
    "Intro",
  );
  failTopics = true;
  assert.deepEqual((await service.getCourse("real")).data.topics, []);
});

test("missing real details differ from network errors", async () => {
  let status = 404;
  const load = createLoader({
    "@/lib/api": {
      api: {
        get: async () => {
          throw { response: { status } };
        },
      },
    },
  });
  const service = load("services/course.service.ts");
  assert.equal((await service.getCourse("missing")).data, null);
  status = 500;
  await assert.rejects(service.getCourse("missing"));
});

test("prices handle free courses, discounts and invalid discount values", () => {
  const { coursePrice } = createLoader()("types/course.ts");
  assert.equal(coursePrice({ price: 100, discountedPrice: 0 }), 0);
  assert.equal(coursePrice({ price: 100, discountedPrice: 80 }), 80);
  assert.equal(coursePrice({ price: 100, discountedPrice: 200 }), 100);
  assert.equal(coursePrice({ price: 100, discountedPrice: -10 }), 100);
  assert.equal(coursePrice({ price: 100 }), 100);
});

test("auth validates email, phone, password confirmation and OTP per step", () => {
  const { schemaFor } = createLoader()("lib/auth-validation.ts");
  const valid = {
    email: "learner@example.com",
    phoneNumber: "09123456789",
    password: "test-password",
    confirmPassword: "test-password",
    otpCode: "123456",
  };
  assert.equal(schemaFor("register").safeParse(valid).success, true);
  assert.equal(
    schemaFor("register").safeParse({ ...valid, phoneNumber: "123" }).success,
    false,
  );
  assert.equal(
    schemaFor("register").safeParse({ ...valid, confirmPassword: "different" })
      .success,
    false,
  );
  assert.equal(
    schemaFor("login").safeParse({ ...valid, email: "bad-email" }).success,
    false,
  );
  assert.equal(
    schemaFor("login").safeParse({ ...valid, password: "" }).success,
    false,
  );
  assert.equal(
    schemaFor("forget-password").safeParse({
      ...valid,
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      otpCode: "",
    }).success,
    true,
  );
  assert.equal(
    schemaFor("reset-password").safeParse({ ...valid, otpCode: "12" }).success,
    false,
  );
});

test("login requires an API token and reuses a stable device ID", async () => {
  const memory = new Map();
  global.localStorage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
  };
  const calls = [];
  let body = { data: { accessToken: "test-jwt" } };
  const load = createLoader({
    "@/lib/api": {
      api: {
        post: async (...args) => {
          calls.push(args);
          return { data: body };
        },
      },
    },
  });
  const service = load("services/auth.service.ts");
  const session = await service.login({
    email: "Learner@example.com",
    password: "test",
  });
  assert.equal(session.token, "test-jwt");
  assert.equal(session.userId, "learner@example.com");
  await service.login({ email: "Learner@example.com", password: "test" });
  assert.equal(
    calls[0][2].headers["x-device-id"],
    calls[1][2].headers["x-device-id"],
  );
  body = { message: "success but no token" };
  await assert.rejects(
    service.login({ email: "learner@example.com", password: "test" }),
  );
  delete global.localStorage;
});

test("password recovery carries its temporary token to step two", async () => {
  const calls = [];
  const load = createLoader({
    "@/lib/api": {
      api: {
        post: async (...args) => {
          calls.push(args);
          return { data: { data: { resetToken: "recovery-only" } } };
        },
      },
    },
  });
  const service = load("services/auth.service.ts");
  const recovery = await service.forgotPassword("learner@example.com");
  await service.resetPassword(
    {
      email: "learner@example.com",
      otpCode: "123456",
      password: "test-password",
    },
    recovery.resetToken,
  );
  assert.equal(calls[1][0], "/user/step2_resetPassword");
  assert.equal(calls[1][2].headers.Authorization, "Bearer recovery-only");
});
