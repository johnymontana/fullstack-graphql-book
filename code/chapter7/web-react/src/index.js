import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  makeVar,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

export const starredVar = makeVar([]);

const AppWithApollo = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const httpLink = createHttpLink({
    uri: "http://localhost:4000",
  });

  const authLink = setContext(async (_, { headers }) => {
    // Only try to fetch access token if user is authenticated
    const accessToken = isAuthenticated
      ? await getAccessTokenSilently()
      : undefined;
    if (accessToken) {
      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      };
    } else {
      return {
        headers: {
          ...headers,
          // We could set additional headers here or a "default" authorization header if needed
        },
      };
    }
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Business: {
          fields: {
            isStarred: {
              read(_, { readField }) {
                return starredVar().includes(readField("businessId"));
              },
            },
          },
        },
      },
    }),
  });

  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="grandstack.auth0.com"
      clientId="4xw3K3cjvw0hyT4Mjp4RuOVSxvVYcOFF"
      redirectUri={window.location.origin}
      audience="https://reviews.grandstack.io"
    >
      <AppWithApollo />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
