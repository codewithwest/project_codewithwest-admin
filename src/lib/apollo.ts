import { HttpLink } from '@apollo/client/link/http';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { ApolloProvider } from '@apollo/client/react';
import { SetContextLink } from '@apollo/client/link/context';
import { useAuthStore } from '../auth/store';

const httpLink = new HttpLink({
  uri: (import.meta as any).env.VITE_API_URL || 'http://localhost:4000/graphql', // Default to localhost if not set
});

const authLink = new SetContextLink((prevContext) => { 
  const { token, userId } = useAuthStore.getState();
  const apiToken = (import.meta as any).env.VITE_API_TOKEN;
  console.log(apiToken);
  return {
    headers: {
      ...((prevContext as any).headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
      "X-API-Key": apiToken || "",
      user_id: userId || "",
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
