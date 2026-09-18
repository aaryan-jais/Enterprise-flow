import React, {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  login,
} from "../store/slices/authSlice";

import { useToast } from "../components/common/ToastContext";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isAuthenticated,
  } = useSelector(
    (state) => state.auth
  );

  const { showToast } = useToast();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !password) {
      showToast(
        "Please enter email and password",
        "error"
      );

      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (
        email ===
          "admin@enterprise.com" &&
        password === "123456"
      ) {
        dispatch(
          login({
            user: {
              id: 1,
              name: "Aaryan Raj",
              email:
                "admin@enterprise.com",
              role: "Administrator",
            },

            token:
              "demo-jwt-token-123456",
          })
        );

        showToast(
          "Login successful"
        );

        const from =
          location.state?.from
            ?.pathname ||
          "/dashboard";

        navigate(from, {
          replace: true,
        });
      } else {
        showToast(
          "Invalid email or password",
          "error"
        );
      }

      setLoading(false);
    }, 700);
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-brand">

          <div className="login-logo">
            EF
          </div>

          <div>
            <h1>
              EnterpriseFlow
            </h1>

            <p>
              Operations Dashboard
            </p>
          </div>

        </div>

        <div className="login-heading">
          <h2>
            Welcome back
          </h2>

          <p>
            Sign in to continue to
            your dashboard.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>
              Email
            </label>

            <div className="input-icon-wrapper">

              <Mail size={17} />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
              />

            </div>

          </div>

          <div className="form-group">

            <label>
              Password
            </label>

            <div className="input-icon-wrapper">

              <Lock size={17} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>

            </div>

          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        <div className="demo-credentials">
          <strong>
            Demo Credentials
          </strong>

          <span>
            admin@enterprise.com
          </span>

          <span>
            Password: 123456
          </span>
        </div>

      </div>

    </div>
  );
};

export default Login;