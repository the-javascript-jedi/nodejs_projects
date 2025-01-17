export const resolvers = {
  Query: {
    jobs: () => {
      return [
        {
          id: "test-id-1",
          title: "The Title 1",
          description: "The description 1",
          testBatman: "test Data 1",
        },
        {
          id: "test-id-2",
          title: "The Title 2",
          description: "The description 2",
          testBatman: "test Data 2",
        },
      ];
    },
  },
};
