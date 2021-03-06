import merge from "deepmerge";
import gql from "graphql-tag";
import { buildSchema } from "graphql";

import { flatten } from "../../utils";

export const schema = buildSchema(`
  type Success {
    success: Boolean!
  }

  type Card {
    id: Int!
    title: String!
  }

  type CardsList {
    id: Int!
    title: String!
    cards: [Card!]!
  }

  type Query {
    card(id: Int!): Card!
    list(id: Int!): CardsList!
    lists: [CardsList!]!
  }

  input CardInput {
    title: String!
  }

  input CardsListInput {
    title: String!
  }

  type Mutation {
    updateCard(id: Int!, update: CardInput!): Card!
    updateList(id: Int!, update: CardsListInput!): CardsList!
    newCard(listId: Int!, title: String!): Card!
    moveCard(id: Int!, listId: Int!, index: Int!): Success!
  }
`);

const cardFields = "id title";
const listFields = `id title cards { ${cardFields} }`;
const listsFields = `lists { ${listFields} }`;

export const queries = {
  lists: gql(`
    query Lists {
      ${listsFields}
    }
  `),
  list: gql(`
    query List($id: Int!) {
      list(id: $id) {
        ${listFields}
      }
    }
  `),
  updateList: gql(`
    mutation UpdateList($id: Int!, $update: CardsListInput!) {
      updateList(id: $id, update: $update) {
        ${listFields}
      }
    }
  `),
  newCard: gql(`
    mutation AddCard($listId: Int!, $title: String!) {
      newCard(listId: $listId, title: $title) {
        ${cardFields}
      }
    }
  `),
  card: gql(`
    query Card($id: Int!) {
      card(id: $id) {
        ${cardFields}
      }
    }
  `),
  updateCard: gql(`
    mutation UpdateCard($id: Int!, $update: CardInput!) {
      updateCard(id: $id, update: $update) {
        ${cardFields}
      }
    }
  `),
  moveCard: gql(`
    mutation MoveCard($id: Int!, $listId: Int!, $index: Int!) {
      moveCard(id: $id, listId: $listId, index: $index) {
        success
      }
    }
  `)
};

export const makeResolver = (initialStore = { lists: [] }) => {
  const store = merge({}, initialStore);

  let lastCardId = store.lists
    .map(list => list.cards)
    .reduce((acc, cards) => acc.concat(cards), [])
    .map(card => card.id)
    .reduce((x, y) => Math.max(x, y), 0);

  const findList = id => store.lists.find(list => list.id === id);

  const findCard = id =>
    flatten(store.lists.map(list => list.cards)).find(card => card.id === id);

  return {
    lists: () => store.lists,
    list: ({ id }) => findList(id),
    card: ({ id }) => findCard(id),
    updateList: ({ id, update }) => Object.assign(findList(id), update),
    newCard: ({ listId, title }) => {
      const newCard = { id: ++lastCardId, title };
      findList(listId).cards.push(newCard);
      return newCard;
    },
    updateCard: ({ id, update }) => Object.assign(findCard(id), update),
    moveCard: ({ id, listId, index }) => {
      let fromIndex = null;
      let listFrom = null;
      try {
        for (let i = 0; i < store.lists.length; i++) {
          fromIndex = store.lists[i].cards.findIndex(card => card.id === id);
          if (fromIndex !== -1) {
            listFrom = store.lists[i];
            break;
          }
        }
        const listTo = findList(listId);
        const card = listFrom.cards.splice(fromIndex, 1)[0];
        listTo.cards.splice(index, 0, card);
      } catch (error) {
        return { success: false };
      }
      return { success: true };
    }
  };
};
