import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  loadingToggleAction,
  loginAction,
} from "../../../store/actions/AuthActions";

import logoFull from "../../../assets/images/logo.png";

function Login(props) {
  const [email, setEmail] = useState("");
  let errorsObj = { email: "", password: "" };
  const [errors, setErrors] = useState(errorsObj);
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onLogin(e) {
    e.preventDefault();

    let error = false;
    const errorObj = { ...errorsObj };

    if (email === "") {
      errorObj.email = "El correo es obligatorio";
      error = true;
    }

    if (password === "") {
      errorObj.password = "La contraseña es obligatoria";
      error = true;
    }

    setErrors(errorObj);

    if (error) {
      return;
    }

    dispatch(loadingToggleAction(true));
    dispatch(loginAction(email, password, navigate));
  }

  return (
    <div className="fix-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-6">
            <div className="card mb-0 h-auto">
              <div className="card-body">
                <div className="text-center mb-2">
                  <Link to={"/dashboard"}>
                    <img src={logoFull} alt="logo" />
                  </Link>
                </div>

                <h4 className="text-center mb-4">Iniciar sesión</h4>

                {props.errorMessage && (
                  <div className="text-danger p-1 my-2">
                    {props.errorMessage}
                  </div>
                )}

                {props.successMessage && (
                  <div className="text-success p-1 my-2">
                    {props.successMessage}
                  </div>
                )}

                <form onSubmit={onLogin}>
                  <div className="mb-3">
                    <label className="mb-1">
                      <strong>Correo</strong>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Escriba su dirección de correo"
                    />
                    {errors.email && (
                      <div className="text-danger fs-12">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="mb-1">
                      <strong>Contraseña</strong>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      placeholder="Estriba su contraseña"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && (
                      <div className="text-danger fs-12">{errors.password}</div>
                    )}
                  </div>

                  <div className="row d-flex justify-content-between mt-4 mb-2">
                    <div className="mb-3">
                      <div className="form-check custom-checkbox ms-1">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="basic_checkbox_1"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="basic_checkbox_1"
                        >
                          Recordarme
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-block">
                      Iniciar sesión
                    </button>
                  </div>
                </form>

                <div className="new-account mt-3">
                  {/*
                                    <p>
                                        Don't have an account? <Link to="/page-register" className="text-primary">Sign up</Link>
                                    </p>
                                    */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  };
};

export default connect(mapStateToProps)(Login);
