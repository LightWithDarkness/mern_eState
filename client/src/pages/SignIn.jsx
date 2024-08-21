import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reqStart,reqFailure, signInSuccess } from "../redux/user/user.slice";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [userData, setUserData] = useState({});
const {err, loading } = useSelector((state)=>state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch()
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
      dispatch(reqStart())
      const res = await fetch("/api/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success == false) {
        dispatch(reqFailure(data))
        return;
      }
      dispatch(signInSuccess(data.user))
      navigate("/");
    } catch (error) {
      dispatch(reqFailure(error))
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="font-semibold text-3xl my-7 text-center">Sign In</h1>
      <form onSubmit={submitUser} className="flex flex-col gap-4">
        
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="p-3 bg-white rounded-lg"
          onChange={handleInputChange}
          required
        />
        <input
          id="password"
          type="text"
          placeholder="Password"
          className="p-3 bg-white rounded-lg"
          onChange={handleInputChange}
          required
        />
        <button
          disabled={loading}
          className="bg-cyan-600 text-white p-3 my-2 rounded-lg hover:opacity-95 disabled:opacity-85"
        >
          {loading ? "processing..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-4">
        <p>Dont have an account?</p>
        <span className="text-cyan-700">
          <Link to="/sign-up">Sign Up</Link>
        </span>
      </div>
      <p className="text-red-600 py-5 text-center">
        {err ? err.message : ""}
      </p>
    </div>
  );
};
export default SignUp;
