import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/Login" />;
};

export const PrivateRouteOtp = ({ children }) => {
  const Isotp = localStorage.getItem("IsOtp");
  return Isotp ? <Outlet /> : <Navigate to="/Email" />;
};

