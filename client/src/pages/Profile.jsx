import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase.js";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import {
  reqStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserSuccess,
  signOutSuccess,
  signOutFailure
} from "../redux/user/user.slice.js";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [userData, setUserData] = useState({});
  const [progressPercent, setProgressPercent] = useState(0);
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const { currentUser, err, loading } = useSelector((state) => state.user);

  // console.log(userData, progressPercent);
  useEffect(() => {
    if (image) {
      handleImgUpload(image);
    }
  }, [image]);

  const handleImgUpload = async (img) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + img.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, img);
    //uploadBytesResumable() to listen for state changes, errors, and successful uploads. These three callback functions are run at different stages of the file upload. The first runs during the upload to observe state change events like progress, pause, and resume, while the next one is triggered when there is an unsuccessful upload. Finally, the last is run when the upload completes successfully.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgressPercent(progress);
      },
      (error) => {
        console.log(error);
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setUserData({ ...userData, avatar: downloadURL })
        );
      }
    );
  };
  const handleUpdateUser = async (evt) => {
    evt.preventDefault();
    try {
      dispatch(reqStart());
      setUpdateSuccess(false);

      const res = await fetch(`/api/v1/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      // console.log(res);
      const data = await res.json();
      console.log(data);
      if (!data.success) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data.user));
      setUpdateSuccess(true);
    } catch (error) {
      console.log(error);
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(reqStart());
      const res = await fetch(`/api/v1/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess());
      navigate("/");
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };
  const handleSignOut = async () => {
      try {
        dispatch(reqStart());
        const res = await fetch(`/api/v1/auth/signout/${currentUser._id}`);
        const data = await res.json();
        // console.log(data)
        if (!data.success) {
          dispatch(signOutFailure(data));
          return;
        }
        dispatch(signOutSuccess());
        navigate("/sign-in");
      } catch (error) {
        dispatch(signOutFailure(error));
      }
  };

  return (
    <div className="flex flex-col max-w-lg mx-auto p-4 my-5">
      <h1 className="font-semibold text-3xl text-center py-4">Profile</h1>
      <form onSubmit={handleUpdateUser} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          hidden
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={userData.avatar || (currentUser && currentUser.avatar)}
          alt="profile"
          className="my-4 w-24 h-24 rounded-full object-cover self-center cursor-pointer"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-700">
              Error uploading (image must be less than 2 mb)
            </span>
          ) : progressPercent > 0 && progressPercent < 100 ? (
            <span className="text-slate-700">{`Uploading: ${progressPercent}%`}</span>
          ) : progressPercent === 100 ? (
            <span className="text-green-700">Image Upload Successful</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          onChange={(evt) =>
            setUserData({ ...userData, [evt.target.id]: evt.target.value })
          }
        />
        <input
          type="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={(evt) =>
            setUserData({ ...userData, [evt.target.id]: evt.target.value })
          }
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={(evt) =>
            setUserData({ ...userData, [evt.target.id]: evt.target.value })
          }
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Processing..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign out
        </span>
      </div>
      <p className="text-red-500 mt-5 text-center">
        {err && (err.message || "Something went wrong")}
      </p>
      <p className="text-green-500  text-center">
        {updateSuccess && "user updated successfully"}
      </p>
    </div>
  );
};
export default Profile;
