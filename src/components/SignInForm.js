import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (event) => {
    let target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    //let name = target.name;

    //setName(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Submitted Form");
  };

  return (
    <div className="formCenter">
      <form className="formFields" onSubmit={this.handleSubmit}>
        <div className="formField">
          <label className="formFieldLabel" htmlFor="email">
            E-Mail Address
          </label>
          <input
            type="email"
            id="email"
            className="formFieldInput"
            placeholder="Enter your email"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </div>

        <div className="formField">
          <label className="formFieldLabel" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="formFieldInput"
            placeholder="Enter your password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </div>

        <div className="formField">
          <button className="formFieldButton">Sign In</button>{" "}
          <Link to="/" className="formFieldLink">
            Create an account
          </Link>
        </div>

        {/* <div className="socialMediaButtons">
          <div className="facebookButton">
            <FacebookLoginButton onClick={() => alert("Hello")} />
          </div>

          <div className="instagramButton">
            <InstagramLoginButton onClick={() => alert("Hello")} />
          </div>
        </div> */}
      </form>
    </div>
  );
};

export default SignInForm;
