import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // console.log(error)


  //handle change in inputs
  const handleInputChange = (evt) => {
    const newUser = { ...userData, [evt.target.id]: evt.target.value };
    setUserData(newUser);
  };
  //save the user
  const submitUser = async (evt) => {
    evt.preventDefault();
 

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success == false) {
        setError(data);
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate("/sign-in");
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="font-semibold text-3xl my-7 text-center">Sign Up</h1>
      <form onSubmit={submitUser} className="flex flex-col gap-4">
        <input
          id="username"
          type="text"
          placeholder="Username"
          className="p-3 bg-white rounded-lg"
          onChange={handleInputChange}
        />
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="p-3 bg-white rounded-lg"
          onChange={handleInputChange}
        />
        <input
          id="password"
          type="text"
          placeholder="Password"
          className="p-3 bg-white rounded-lg"
          onChange={handleInputChange}
        />
        <button
          disabled={loading}
          className="bg-cyan-600 text-white p-3 my-2 rounded-lg hover:opacity-95 disabled:opacity-85"
        >
          {loading ? "processing..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-4">
        <p>Have an account?</p>
        <span className="text-cyan-700">
          <Link to="/sign-in">Sign In</Link>
        </span>
      </div>
      <p className="text-red-600 py-5 text-center">
        {error ? error.message : ""}
      </p>
    </div>
  );
};
export default SignUp;
