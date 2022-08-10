import { Navigate, Outlet } from "react-router";
export const ProtectedRoute = ({
    user,
    redirectPath = '/login',
    children,
  }) => {
    if (!user) {
      return <Navigate to={redirectPath} replace />;
    }
  
    return children ? children : <Outlet />;
  };