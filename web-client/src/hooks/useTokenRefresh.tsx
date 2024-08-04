import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Refresh } from "@/stores/slices/authSlice";
import { AppDispatch, RootState } from "@/stores/store";

export function useTokenRefresh() {
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const previousLocation = useRef(location.pathname);

  useEffect(() => {
    const refresh = async () => {
      if (accessToken) {
        await dispatch(Refresh());
      }
    };

    if (previousLocation.current !== location.pathname) {
      refresh();
      previousLocation.current = location.pathname;
    }
  }, [dispatch, accessToken, location]);
}
