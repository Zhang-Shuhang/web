function checkKey(key, action) {
  if (!key) {
    throw new Error(`${action}操作失败：缺少key`);
  }
}

export default {
  set(key, value) {
    checkKey(key, "set");

    if (typeof value === "undefined") {
      throw new Error(`${key}值为undefined`);
    }

    let valueToStore;

    switch (typeof value) {
      case "object":
        if (value === null) {
          valueToStore = "null";
        } else {
          valueToStore = JSON.stringify(value);
        }
        break;
      default:
        valueToStore = value.toString();
    }

    localStorage.setItem(key, valueToStore);
  },

  get(key) {
    checkKey(key, "get");

    const rawValue = localStorage.getItem(key);

    if (!rawValue) {
      return undefined;
    }

    try {
      if (rawValue === "true") return true;
      if (rawValue === "false") return false;
      if (rawValue === "null") return null;
      return JSON.parse(rawValue);
    } catch (error) {
      if (error instanceof SyntaxError) {
        return rawValue;
      }
      throw error;
    }
  },

  remove(key) {
    checkKey(key, "remove");
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },

  getAllKeys() {
    return Object.keys(localStorage);
  },

  has(key) {
    checkKey(key, "has");
    return localStorage.getItem(key) !== null;
  },
};
