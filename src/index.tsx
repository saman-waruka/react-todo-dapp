import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const wsLink = new GraphQLWsLink(createClient({
  url: 'wss://api.studio.thegraph.com/query/27554/samansubgraph/v0.0.44',
}));

const httpLink = new HttpLink({
  uri: 'https://api.studio.thegraph.com/query/27554/samansubgraph/v0.0.44'
});

const splitLink = split(
  ({ query }: any) => {

    const definition = getMainDefinition(query);

    console.log(" splitLink definition ", definition)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  // uri: 'https://api.studio.thegraph.com/query/27554/samansubgraph/v0.0.44',
  link: splitLink,
  cache: new InMemoryCache(),
});




const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <ApolloProvider client={client}>
  <App />

  </ApolloProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
