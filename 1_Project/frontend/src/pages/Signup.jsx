import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";

const Signup = () => {
  const { signup } = useContext(AuthContext);

  const [form, setForm] = useState({
    username: "",
    // email : "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(form); 
    console.log(form);
  };
  return (
    <form action="" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
