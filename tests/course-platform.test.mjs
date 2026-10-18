import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const runtimeRequire = createRequire(import.meta.url);
const projectDirectory = fileURLToPath(new URL('../', import.meta.url));

// Load server modules with only Next's request-scoped cookies stubbed.
function harness() {
  const loaded = new Map();
  const cookieValues = new Map();
  const cookieStore = {
    get: name => cookieValues.get(name),
    set: (name, value, options) => cookieValues.set(name, { value, options }),
    delete: name => cookieValues.delete(name),
  };
  function load(filename) {
    const absolute = path.resolve(projectDirectory, 'src/util/service/course-platform', filename);
    if (loaded.has(absolute)) return loaded.get(absolute).exports;
    const source = fs.readFileSync(absolute, 'utf8');
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    const record = { exports: {} };
    loaded.set(absolute, record);
    const localRequire = name => {
      if (name === 'server-only') return {};
      if (name === 'next/headers') return { cookies: async () => cookieStore };
      if (name === 'next/navigation') return { redirect: () => { throw new Error('unexpected redirect'); } };
      if (name.startsWith('.')) return load(path.relative(path.resolve(projectDirectory, 'src/util/service/course-platform'), path.resolve(path.dirname(absolute), `${name}.ts`)));
      return runtimeRequire(name);
    };
    new Function('require', 'module', 'exports', compiled)(localRequire, record, record.exports);
    return record.exports;
  }
  return { load, cookieValues };
}

test('list request preserves free-price zero, search and pagination', async t => {
  t.mock.method(global, 'fetch', async (url, options) => {
    const parsed = new URL(url);
    assert.equal(parsed.pathname, '/course/getAllCourseWithPagination');
    assert.equal(parsed.searchParams.get('maxPrice'), '0');
    assert.equal(parsed.searchParams.get('search'), 'react & next');
    assert.equal(parsed.searchParams.get('page'), '2');
    assert.equal(options.body, undefined);
    assert.equal(options.cache, 'no-store');
    return Response.json({ data: [] });
  });
  process.env.COURSE_API_URL = 'http://localhost:3000/';
  await harness().load('api.ts').requestCourseList({ search: 'react & next', maxPrice: 0, page: 2, limit: 6 });
});

test('login posts the documented body and per-device header', async t => {
  t.mock.method(global, 'fetch', async (_url, options) => {
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.get('x-device-id'), 'synthetic-device');
    assert.deepEqual(JSON.parse(options.body), { email: 'user@example.test', password: 'test-password' });
    return Response.json({ data: { accessToken: 'synthetic-token' } });
  });
  await harness().load('api.ts').requestLogin({ email: 'user@example.test', password: 'test-password' }, 'synthetic-device');
});

test('registration strips confirmation before transmission and validates matching passwords', async t => {
  let requests = 0;
  t.mock.method(global, 'fetch', async (_url, options) => {
    requests++;
    assert.deepEqual(JSON.parse(options.body), { email: 'user@example.test', phoneNumber: '09000000000', password: 'test-password' });
    return Response.json({ status: 201 });
  });
  const action = harness().load('auth-actions.ts').registerCourseAccount;
  const fields = { email: 'user@example.test', phoneNumber: '09000000000', password: 'test-password', passwordRepeat: 'different' };
  const form = values => { const result = new FormData(); for (const [key, value] of Object.entries(values)) result.set(key, value); return result; };
  const invalid = await action({}, form(fields));
  assert.equal(invalid.success, false);
  assert.ok(invalid.errors.passwordRepeat.length);
  assert.equal(requests, 0);
  assert.equal((await action({}, form({ ...fields, passwordRepeat: 'test-password' }))).success, true);
  assert.equal(requests, 1);
});

test('password reset sends otpCode and omits password confirmation', async t => {
  t.mock.method(global, 'fetch', async (url, options) => {
    assert.ok(url.endsWith('/user/step2_resetPassword'));
    assert.deepEqual(JSON.parse(options.body), { email: 'user@example.test', otpCode: '000000', password: 'test-password' });
    return Response.json({ status: 200 });
  });
  const form = new FormData();
  for (const [key, value] of Object.entries({ email: 'user@example.test', otpCode: '000000', password: 'test-password', passwordRepeat: 'test-password' })) form.set(key, value);
  assert.equal((await harness().load('auth-actions.ts').resetCoursePassword({}, form)).success, true);
});

test('failed HTTP or application status never produces success', async t => {
  const client = harness().load('client.ts');
  t.mock.method(global, 'fetch', async () => Response.json({ status: 401, message: 'invalid login' }, { status: 401 }));
  await assert.rejects(() => client.coursePlatformRequest('/user/login'), error => error.status === 401 && error.message === 'invalid login');
  global.fetch.mock.mockImplementation(async () => Response.json({ status: 400, message: 'invalid request' }));
  await assert.rejects(() => client.coursePlatformRequest('/user/register'), error => error.status === 400);
});

test('login action stores HttpOnly tokens and keeps device identity stable', async t => {
  const { load, cookieValues } = harness();
  t.mock.method(global, 'fetch', async () => Response.json({ data: { accessToken: 'synthetic-access', refreshToken: 'synthetic-refresh' } }));
  const form = new FormData(); form.set('email', 'user@example.test'); form.set('password', 'test-password');
  const state = await load('auth-actions.ts').loginCourseAccount({}, form);
  assert.equal(state.success, true);
  assert.equal(cookieValues.get('course_access_token').options.httpOnly, true);
  assert.equal(cookieValues.get('course_refresh_token').options.httpOnly, true);
  assert.equal(JSON.stringify(state).includes('synthetic-access'), false);
  const session = load('session.ts');
  const device = await session.getOrCreateDeviceId();
  assert.equal(await session.getOrCreateDeviceId(), device);
  await session.clearCourseSession();
  assert.equal(cookieValues.has('course_access_token'), false);
  assert.equal(cookieValues.has('course_refresh_token'), false);
});

test('course parser uses actual envelope and drops private lesson URL fields', () => {
  const { load } = harness();
  const contract = load('course-contract.ts');
  const payload = { data: { pagination: { currentPage: 1, limit: 6, totalcourses: 1, totalPage: 1 }, data: [{ id: 'example-course', title: 'Example', description: 'Description', price: 10, teacherName: 'Example Teacher', isPublished: true, createdAt: '2026-10-18', courseCoverUrl: 'http://localhost:3000/uploads/cover.png' }] } };
  assert.equal(contract.courseListResponseSchema.parse(payload).data.data.length, 1);
  const topics = contract.topicsResponseSchema.parse({ data: { topics: [{ id: 1, topicName: 'Topic', courseLesson: [{ id: 'lesson', lessonName: 'Lesson', videoUrl: 'not-for-client' }] }] } });
  assert.equal('videoUrl' in topics.data.topics[0].courseLesson[0], false);
  assert.equal(contract.toCourse(payload.data.data[0], 'http://localhost:3000').teacher, 'Example Teacher');
  assert.equal(contract.toCourse({ ...payload.data.data[0], courseCoverUrl: 'https://unrelated.example/cover.png' }, 'http://localhost:3000').coverUrl, null);
});
