export const getOriginalId = (graphqlId: string): string => {
  return graphqlId.split("_")[1];
};
