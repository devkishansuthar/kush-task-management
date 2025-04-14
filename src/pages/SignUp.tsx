
import React from "react";
import { Navigate } from "react-router-dom";
import SignUpForm from "@/components/auth/SignUpForm";
import { useAuth } from "@/context/AuthContext";

const SignUp = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <SignUpForm />
    </div>
  );
};

export default SignUp;
