import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: "http://192.168.15.7:4000/graphql" }),
  cache: new InMemoryCache(),
});