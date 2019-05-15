// @flow

// NPM Modules
import { findIndex } from "lodash";

// External Modules
import { DICTIONARY_STATUSES } from "@modules/shared/constants/index";

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
          { id: generateId(), domain: "stonegrey", range: "dark grey" },
          { id: generateId(), domain: "midnight black", range: "black" },
          { id: generateId(), domain: "mystic silver", range: "silver" },
          { id: generateId(), domain: "mystic silver", range: "silver" },
          { id: generateId(), domain: "silver", range: "mystic silver" },
          { id: generateId(), domain: "midnight black", range: "dark grey" },
          { id: generateId(), domain: "", range: "" }
        ],
        status: DICTIONARY_STATUSES.DRAFT
      },
      {
        id: generateId(),
        title: "Car Colors",
        entries: [
          { id: generateId(), domain: "racing red", range: "red" },
          { id: generateId(), domain: "turbo turqoise", range: "cyan" },
          { id: generateId(), domain: "speedy silver", range: "silver" },
          { id: generateId(), domain: "yawning yellow", range: "yellow" }
        ],
        status: DICTIONARY_STATUSES.VALID
      }
    ]);
    return getDictionaries();
  }
};

export const getDictionary = (dictionaryId: string): * => {
  return getDictionaries()
    .then(
      (dictionaries): * => dictionaries.find(({ id }): * => id === dictionaryId)
    )
    .catch((err): void => err);
};

export const getNewDictionary = (dictionaryId: string): * => ({
  id: dictionaryId,
  title: "",
  entries: [],
  status: DICTIONARY_STATUSES.DRAFT
});

export const createDictionary = (newDictionary: *): * => {
  return getDictionaries()
    .then(
      (dictionaries): * => {
        const index = findIndex(
          dictionaries,
          (dictionary): boolean => dictionary.id === newDictionary.id
        );
        if (index === -1) {
          const newDictionaries = dictionaries.concat(newDictionary);
          return setDictionaries(newDictionaries);
        } else {
          throw new Error("dictionary with this id already exists");
        }
      }
    )
    .catch((err): void => err);
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
    .catch((err): void => err);
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
        .catch((err): void => err);
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
