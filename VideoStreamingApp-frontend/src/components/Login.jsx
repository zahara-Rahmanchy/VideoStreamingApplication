import React, {useContext, useState} from "react";
import {AuthContext} from "../firebase/AuthProvider";
import {Link} from "react-router-dom";

const Login = () => {
  const {logIn} = useContext(AuthContext);
  const [error, setError] = useState();
  const handleLogin = e => {
    setError("");
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    // console.log(email, password);

    logIn(email, password)
      .then(result => {
        const user = result.user;
        // console.log(user);
        alert("logged In Successfully");
        form.reset();

        navigate(fromCurrentLocation, {replace: true});
      })
      .catch(error => setError(error.message));
  };

  return (
    <div className="hero  min-h-screen  rounded-md mx-auto max-w-6xl shadow-lg  mt-5">
      <div className="hero-content flex-col md:flex-row">
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-transparent">
          <form onSubmit={handleLogin} id="form">
            <h1 className="text-center my-6 text-4xl font-serif italic font-semibold text-transparent bg-clip-text bg-gradient-to-r  from-teal-300 via-base-600 to-teal-500">
              Login
            </h1>
            <div className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="text"
                  placeholder="email"
                  className="input input-bordered"
                  name="email"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  name="password"
                />
                <p className="my-4 ">
                  <span className="text-sm font-light">
                    {" "}
                    Don't Have an Account?{" "}
                  </span>
                  <Link
                    className="text-blue-600 font-semibold hover:link"
                    to="/signup"
                  >
                    Sign Up
                  </Link>{" "}
                </p>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="form-control mt-6">
                <button
                  className="btn border-0 bg-gradient-to-r  from-teal-300 via-base-600 to-teal-500 "
                  type="submit"
                >
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
