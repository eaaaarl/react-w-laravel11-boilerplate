import { Login } from "@/stores/slices/authSlice";
import { AppDispatch } from "@/stores/store";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginPage() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleLogin = async () => {
    setLoading(true);
    const response = await dispatch(Login({ ...form }));
    if (Login.fulfilled.match(response)) {
      toast.success("Login Successfully!");
      navigate("/dashboard");
    } else {
      toast.info((response.payload as { message: string }).message);
    }
    setLoading(false);
  };
  return (
    <div className="card card-outline card-primary">
      <div className="card-header text-center">
        <a href="../../index2.html" className="h1">
          <b>Admin</b>LTE
        </a>
      </div>
      <div className="card-body">
        <p className="login-box-msg">Sign in to start your session</p>
        <div className="input-group mb-3">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="form-control"
            placeholder="Email"
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <span className="fas fa-envelope"></span>
            </div>
          </div>
        </div>
        <div className="input-group mb-3">
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            type="password"
            className="form-control"
            placeholder="Password"
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <span className="fas fa-lock"></span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border text-align-center" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                type="submit"
                className="btn btn-primary btn-block"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
