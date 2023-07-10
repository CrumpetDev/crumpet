import React from 'react';
import { Link } from 'react-router-dom';
import SidebarMenu from 'components/sidebarMenu';

const Welcome = () => {
  return (
    <SidebarMenu />
    // <div className="container bg-gray-200 rounded-xl p-8">
    //   <p className="text-3xl text-primary">Welcome!</p>
    // <SidebarMenu text="some text"/>
    //   <Link to="/login" className="text-primary">
    //     Login Page
    //   </Link>
    // </div>
  );
};

export default Welcome;
