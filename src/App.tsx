import { ApolloProvider } from '@apollo/client/react';
import { client } from './lib/apollo';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Home, Settings, Layout, AdminUsers, Projects, ProjectCategories, AccessRequests } from './components';
import { ProtectedRoute } from './auth/ProtectedRoute';
import LoginPage from './auth/LoginPage';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout><Outlet /></Layout>}>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/categories" element={<ProjectCategories />} />
              <Route path="/access-requests" element={<AccessRequests />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ApolloProvider>
  );
}
