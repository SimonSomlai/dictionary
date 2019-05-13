// @flow

// NPM Modules

// External Modules

// Components

// Queries & Query Constants

// Assets & Styles

export const setDictionaries = (obj: *): * => {
  localStorage.setItem("dictionaries", JSON.stringify(obj));
};

export const getDictionaries = (): * => {
  const data = localStorage.getItem("dictionaries");
  if (data) {
    return new Promise((resolve): * => resolve(JSON.parse(data)));
  } else {
    setDictionaries([
      {
        id: generateId(),
        title: "Phone Colors",
        entries: [
          { id: generateId(), domain: "stonegrey", range: "dark grey" },
          { id: generateId(), domain: "midnight black", range: "black" },
          { id: generateId(), domain: "mystic silver", range: "silver" }
        ],
        status: "DRAFT"
      },
      {
        id: generateId(),
        title: "Car Colors",
        entries: [
          { id: generateId(), domain: "racing red", range: "red" },
          { id: generateId(), domain: "turbo turqoise", range: "cyan" },
          { id: generateId(), domain: "speedy silver", range: "silver" }
        ],
        status: "VALID"
      }
    ]);
    return getDictionaries();
  }
};

export const getDictionary = (dictionaryId: string): * => {
  return getDictionaries()
    .then(
      (data): * => {
        return data.find(({ id }): * => id === dictionaryId);
      }
    )
    .catch((err): void => alert(JSON.stringify(err)));
};

export const deleteDictionary = (dictionaryId: string): * => {
  return new Promise((resolve, reject) => {
    const shouldDelete = window.confirm(
      "are you sure you want to delete this dictionary?"
    );
    if (shouldDelete) {
      getDictionaries()
        .then(data => {
          const newDictionaries = data.filter(
            ({ id }): * => id !== dictionaryId
          );
          setDictionaries(newDictionaries);
          resolve();
        })
        .catch((err): void => alert(JSON.stringify(err)));
    } else {
      reject();
    }
  });
};

export const generateId = (): string => {
  return Math.random()
    .toString(36)
    .substr(2, 16);
};
