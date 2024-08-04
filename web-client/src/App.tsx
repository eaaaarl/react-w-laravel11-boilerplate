import React, { useEffect } from "react";
import Router from "./router";
import { useDispatch } from "react-redux";
import { establishAuth, Refresh } from "./stores/slices/authSlice";
import { AppDispatch } from "./stores/store";

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user") ?? "null");
    if (token && user) {
      dispatch(establishAuth({ user, accessToken: token }));
      setTimeout(() => {
        dispatch(Refresh());
      }, 100);
    }
  }, [dispatch]);
  return <Router />;
};

export default App;
