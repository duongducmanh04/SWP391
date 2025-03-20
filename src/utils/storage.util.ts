const localStorageRemoveItems = (...arg: string[]) => {
  for (const item of arg) {
    localStorage.removeItem(item);
  }
};

const sessionStorageRemoveItems = (...arg: string[]) => {
  for (const item of arg) {
    sessionStorage.removeItem(item);
  }
};

const storageRemoveItems = (...arg: string[]) => {
  localStorageRemoveItems(...arg);
  sessionStorageRemoveItems(...arg);
};

export default {
  localStorageRemoveItems,
  sessionStorageRemoveItems,
  storageRemoveItems,
};
