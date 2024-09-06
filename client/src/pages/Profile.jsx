import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
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
  signOutFailure,
} from "../redux/user/user.slice.js";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [userData, setUserData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [listings, setListings] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const { currentUser, err, loading } = useSelector((state) => state.user);

  console.log(listings);
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
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/v1/user/listings/${currentUser._id}`);
      const data = await res.json();
      // console.log(data)
      if (data.success === false) {
        return setShowListingsError(data.message);
      }
      setListings(data.listings);
    } catch (error) {
      setShowListingsError(error.message);
    }
  };
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/v1/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        console.log("error:", data.message);
        return;
      }
      setListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col max-w-lg mx-auto p-4 ">
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
          className="mt-3 w-24 h-24 rounded-full object-cover self-center cursor-pointer"
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
        <Link
          className="bg-green-700 text-white p-3 rounded-lg text-center hover:opacity-95"
          to="/create-listing"
        >
          Create Listing
        </Link>
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
      <p className="text-red-500 mt-2 text-center">
        {err && (err.message || "Something went wrong")}
      </p>
      <p className="text-green-700  text-center">
        {updateSuccess && "user updated successfully"}
      </p>
      <button
        type="button"
        onClick={handleShowListings}
        className="text-green-500 text-center w-full"
      >
        Show Listings
      </button>
      {showListingsError && (
        <p className="text-red-700 mt-2 text-center">{showListingsError || 'Error showing listings'}</p>
      )}

      {listings && listings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageURLs[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Profile;
