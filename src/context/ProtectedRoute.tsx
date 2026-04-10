// ProtectedRoute.tsx
import React from 'react';
import { useHistory, Route, RouteProps } from 'react-router-dom';
import { useAuth } from './AuthContext';

type ProtectedRouteProps = RouteProps & {
  component: React.ComponentType<any>;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component, allowedRoles, ...rest }) => {
  const { user } = useAuth();
  let history = useHistory();

  if (!user) {
    // Redirect to signin page if user is not authenticated
    history.push('/auth/signin');
    window.location.reload();
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role || "guest")) {
    // Redirect to unauthorized page or handle accordingly
    history.push('/unauthorized');
    window.location.reload();
  }

  return <Route {...rest} component={component} />;
};

export default ProtectedRoute;
