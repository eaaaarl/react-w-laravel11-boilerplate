import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { removeAuth } from "@/stores/slices/authSlice";
import { RootState } from "@/stores/store";
import { useTokenRefresh } from "@/hooks/useTokenRefresh";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const location = useLocation();
  useTokenRefresh();

  useEffect(() => {
    if (!isAuthenticated && !accessToken) {
      dispatch(removeAuth());
    }
  }, [isAuthenticated, accessToken, location, dispatch]);

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
