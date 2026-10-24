const assert = require("node:assert/strict");
const { test } = require("node:test");
const createLoader = require("./load-module.cjs");

test("cart, wishlist, checkout, reload and account isolation work together", async () => {
  const { Window } = await import("happy-dom");
  const window = new Window({ url: "http://localhost:3002" });
  for (const key of [
    "window",
    "document",
    "localStorage",
    "Event",
    "HTMLElement",
  ]) {
    global[key] = key === "window" ? window : window[key];
  }
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const React = require("react");
  const { createRoot } = require("react-dom/client");
  const notifications = [];
  const load = createLoader({
    sonner: {
      toast: {
        info: (message) => notifications.push(message),
        success: (message) => notifications.push(message),
        error: (message) => notifications.push(message),
      },
    },
  });
  const { AuthProvider, useAuth } = load("context/AuthContext.tsx");
  const { CartProvider, useCart } = load("context/CartContext.tsx");
  const { mockCourses } = load("lib/mock-courses.ts");
  const { writeStorage } = load("lib/storage.ts");
  let cart;
  let auth;
  function Probe() {
    cart = useCart();
    auth = useAuth();
    return React.createElement("span", null, cart.cart.length);
  }
  const container = document.createElement("div");
  document.body.appendChild(container);
  let root;
  async function mount() {
    root = createRoot(container);
    await React.act(async () => {
      root.render(
        React.createElement(
          AuthProvider,
          null,
          React.createElement(CartProvider, null, React.createElement(Probe)),
        ),
      );
    });
  }

  try {
    await mount();
    assert.equal(auth.ready, true);
    await React.act(async () => {
      cart.add(mockCourses[0]);
      cart.add(mockCourses[0]);
      cart.add(mockCourses[1]);
    });
    assert.equal(cart.cart.length, 2, "duplicate items must be ignored");
    assert.equal(cart.total, 3920000);
    await React.act(async () => {
      cart.toggleWishlist(mockCourses[0]);
    });
    assert.equal(cart.wishlist.length, 1);
    await React.act(async () => {
      cart.toggleWishlist(mockCourses[0]);
    });
    assert.equal(cart.wishlist.length, 0);
    await React.act(async () => {
      cart.remove(mockCourses[1].id);
    });
    assert.equal(cart.total, 1680000);

    let purchase;
    const started = Date.now();
    await React.act(async () => {
      purchase = cart.checkout();
    });
    assert.equal(cart.checkingOut, true);
    assert.equal(await cart.checkout(), false, "double checkout is blocked");
    await React.act(async () => {
      cart.add(mockCourses[1]);
    });
    assert.equal(cart.cart.length, 1, "cart is locked during checkout");
    // Simulate another tab adding an item after this order was confirmed.
    await React.act(async () => {
      writeStorage("course-library:guest", {
        cart: [mockCourses[0], mockCourses[1]],
        purchased: [],
        wishlist: [],
      });
    });
    await React.act(async () => {
      assert.equal(await purchase, true);
    });
    assert.ok(Date.now() - started >= 1450, "checkout keeps its loading delay");
    assert.equal(cart.checkingOut, false);
    assert.equal(cart.cart.length, 1, "later additions remain in the cart");
    assert.equal(cart.cart[0].id, mockCourses[1].id);
    assert.equal(cart.purchased[0].id, mockCourses[0].id);
    assert.equal(cart.purchased.length, 1);
    assert.ok(
      notifications.some((message) => message.includes("خرید آزمایشی موفق")),
    );
    await React.act(async () => {
      cart.remove(mockCourses[1].id);
      cart.add(mockCourses[0]);
    });
    assert.equal(
      cart.cart.length,
      0,
      "already-owned courses cannot be purchased twice",
    );

    await React.act(async () => {
      root.unmount();
    });
    await mount();
    assert.equal(cart.purchased.length, 1, "library survives a remount");
    await React.act(async () => {
      auth.signIn({
        token: "test-a",
        email: "a@example.com",
        userId: "a@example.com",
      });
    });
    assert.equal(
      cart.purchased.length,
      0,
      "guest library is separate from account A",
    );
    await React.act(async () => {
      cart.add(mockCourses[2]);
    });
    await React.act(async () => {
      auth.signIn({
        token: "test-b",
        email: "b@example.com",
        userId: "b@example.com",
      });
    });
    assert.equal(cart.cart.length, 0, "account B cannot see account A's cart");
    await React.act(async () => {
      auth.signIn({
        token: "test-a",
        email: "a@example.com",
        userId: "a@example.com",
      });
    });
    assert.equal(cart.cart[0].id, mockCourses[2].id);
    await React.act(async () => {
      auth.signOut();
    });
    assert.equal(localStorage.getItem("token"), null);
    assert.equal(cart.purchased.length, 1);

    // Invalid persisted content must not crash the UI.
    await React.act(async () => {
      writeStorage("course-library:guest", { cart: "broken" });
    });
    assert.equal(cart.cart.length, 0);
    assert.equal(cart.purchased.length, 0);

    await React.act(async () => {
      cart.add(mockCourses[1]);
    });
    const originalStorage = global.localStorage;
    global.localStorage = {
      getItem: originalStorage.getItem.bind(originalStorage),
      setItem: () => {
        throw new Error("quota exceeded");
      },
    };
    await React.act(async () => {
      assert.equal(await cart.checkout(), false);
    });
    assert.equal(
      cart.cart.length,
      1,
      "failed persistence keeps the cart intact",
    );
    assert.equal(cart.purchased.length, 0);
    global.localStorage = originalStorage;
  } finally {
    await React.act(async () => {
      root.unmount();
    });
    await window.happyDOM.close();
    for (const key of [
      "window",
      "document",
      "localStorage",
      "Event",
      "HTMLElement",
      "IS_REACT_ACT_ENVIRONMENT",
    ])
      delete global[key];
  }
});
