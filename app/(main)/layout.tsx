import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="container mx-auto pt-20 px-4 mb-10">{children}</div>;
};

export default Layout;
