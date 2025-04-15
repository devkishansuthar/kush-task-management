
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
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">TempoTask</h1>
        <p className="text-muted-foreground mt-2">
          Advanced task management for teams
        </p>
      </div>
      <SignUpForm />
    </div>
  </div>
  );
};

export default SignUp;
