import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';

const RedirectPage: React.FC = () => {
  const { user } = useAuth();
  let history = useHistory();
  if (!user) {
    // Redirect to signin page if user is not authenticated
    history.push('/auth/signin');
    window.location.reload();
  } else {
    history.push('/dashboard');
    window.location.reload();
  }

  return <>{/* <div>RedirectPage</div> */}</>;
};

export default RedirectPage;
