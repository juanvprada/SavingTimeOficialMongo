import React from 'react';
import AuthForm from '../components/AuthForm';

const Login = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <AuthForm textColor="text-gray-500" inputTextColor="text-gray-500" formBackground="bg-white bg-opacity-30" />
    </div>
  );
};

export default Login;
