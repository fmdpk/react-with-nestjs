import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col items-start bg-gray-50 p-4 w-full">
      <div className="w-full bg-white rounded-2xl shadow-sm p-10 mb-2">
        <div className="flex items-center justify-center gap-2">
          <span>Dashboard</span>
          <span>Items</span>
          <span></span>
        </div>
      </div>
      <Outlet></Outlet>
    </div>
  );
};

export default Layout;
