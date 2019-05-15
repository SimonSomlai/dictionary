// @flow

// NPM Modules
import { findIndex } from "lodash";

// External Modules

// Components

// Queries & Query Constants

// Assets & Styles

export const setDictionaries = (obj: *): * => {
  localStorage.setItem("dictionaries", JSON.stringify(obj));
};

export const getDictionaries = (): * => {
  const dictionaries = localStorage.getItem("dictionaries");
  if (dictionaries) {
    return new Promise((resolve): * => resolve(JSON.parse(dictionaries)));
  } else {
    setDictionaries([
      {
        id: generateId(),
        title: "Phone Colors",
        entries: [
          { id: "2slxx4vbid8", domain: "stonegrey", range: "dark grey" },
          { id: "gb5ms2iq85g", domain: "midnight black", range: "black" },
          { id: "1xjgj9cv0c3", domain: "mystic silver", range: "silver" },
          { id: "49o6j75x9oz", domain: "mystic silver", range: "silver" },
          { id: "3lvmled4y9", domain: "silver", range: "mystic silver" },
          { id: "fv2i1hwa1xd", domain: "midnight black", range: "dark grey" },
          { id: "roptv64juxr", domain: "", range: "" }
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
      (dictionaries): * => {
        return dictionaries.find(({ id }): * => id === dictionaryId);
      }
    )
    .catch((err): void => alert(JSON.stringify(err)));
};

export const getNewDictionary = (dictionaryId: string): * => ({
  id: dictionaryId,
  title: "",
  entries: [],
  status: "DRAFT"
});

export const createDictionary = (dictionary: *): * => {
  return getDictionaries()
    .then(
      (dictionaries): * => {
        const newDictionaries = dictionaries.concat(dictionary);
        return setDictionaries(newDictionaries);
      }
    )
    .catch((err): void => alert(JSON.stringify(err)));
};

export const updateDictionary = (dictionaryId: string, dictionary: *): * => {
  return getDictionaries()
    .then(
      (dictionaries): * => {
        const index = findIndex(
          dictionaries,
          ({ id }): * => id === dictionaryId
        );
        dictionaries[index] = dictionary;
        return setDictionaries(dictionaries);
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
        .then(dictionaries => {
          const newDictionaries = dictionaries.filter(
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
