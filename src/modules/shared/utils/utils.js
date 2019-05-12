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
        id: 1,
        title: "Colors",
        entries: [
          { domain: "stonegrey", range: "dark grey" },
          { domain: "midnight black", range: "black" },
          { domain: "mystic silver", range: "silver" }
        ],
        status: "DRAFT"
      }
    ]);
    return getDictionaries();
  }
};

export const getDictionary = (dictionaryId: number): * => {
  return getDictionaries().then(
    (data): * => data.find(({ id }): * => id === dictionaryId)
  );
};
