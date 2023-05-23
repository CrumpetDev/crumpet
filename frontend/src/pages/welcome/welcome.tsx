import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="container bg-gray-200 rounded-xl p-8">
      <p className="text-3xl text-primary">Welcome!</p>
      <Link to="/login" className="text-primary">
        Login Page
      </Link>
    </div>
  );
};

export default Welcome;
