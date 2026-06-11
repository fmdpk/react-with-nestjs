import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedLogin = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    // return (
    //   <div className="flex justify-center py-8">
    //     <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    //   </div>
    // );
    return undefined;
  }
  return user ? <Navigate to="/items" replace /> : <Outlet />;
};
