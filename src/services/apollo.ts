import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const API_URL = process.env.GRAPHQL_API_CITY_URL;

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: "https://countries.trevorblades.com" }),
  cache: new InMemoryCache(),
});