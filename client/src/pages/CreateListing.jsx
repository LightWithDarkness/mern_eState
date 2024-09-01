import { useState } from "react";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(true);
  const [formData, setFormData] = useState({
    imageURLs: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    regularPrize: 500,
    discountPrize: 0,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    offer: false,
    userRef: currentUser._id,
  });
  console.log(formData);

  const handleCreateListing = async (evt) => {
    evt.preventDefault();
    try {
      if (formData.imageURLs.length < 1)
        return setErr("You must upload at least one image");
      if (+formData.regularPrize < +formData.discountPrize)
        return setErr("Discount price must be lower than regular price");

      setLoading(true);
      setErr(false);
      const res = await fetch("/api/v1/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (!data.success) {
        return setErr(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setLoading(false);
      setErr(error.message);
    }
  };
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageURLs.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageURLs: formData.imageURLs.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      imageURLs: formData.imageURLs.filter((_, idx) => idx !== index),
    });
  };
  const handleInputChange = (evt) => {
    if (evt.target.id === "sale" || evt.target.id === "rent") {
      setFormData({ ...formData, type: evt.target.id });
    } else if (
      evt.target.id === "offer" ||
      evt.target.id === "furnished" ||
      evt.target.id === "parking"
    ) {
      setFormData({ ...formData, [evt.target.id]: evt.target.checked });
    } else if (
      evt.target.type === "text" ||
      evt.target.type === "textarea" ||
      evt.target.type === "number"
    ) {
      setFormData({ ...formData, [evt.target.id]: evt.target.value });
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl font-bold my-7 text-center">Create a Listing</h1>
      <form
        onSubmit={handleCreateListing}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            maxLength="62"
            minLength="10"
            required
            className=" border p-3 rounded-lg"
            value={formData.name}
            onChange={handleInputChange}
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            required
            className=" border p-3 rounded-lg"
            value={formData.description}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            required
            className=" border p-3 rounded-lg"
            value={formData.address}
            onChange={handleInputChange}
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-4"
                checked={formData.type === "sale"}
                onChange={handleInputChange}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-4"
                checked={formData.type === "rent"}
                onChange={handleInputChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-4"
                checked={formData.parking}
                onChange={handleInputChange}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-4"
                checked={formData.furnished}
                onChange={handleInputChange}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-4"
                checked={formData.offer}
                onChange={handleInputChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                value={formData.bedrooms}
                onChange={handleInputChange}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                value={formData.bathrooms}
                onChange={handleInputChange}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrize"
                min="500"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                value={formData.regularPrize}
                onChange={handleInputChange}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs" hidden={formData.type === "sale"}>
                  (₹ / Month)
                </span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrize"
                  min="500"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  value={formData.discountPrize}
                  onChange={handleInputChange}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs" hidden={formData.type === "sale"}>
                    (₹ / Month)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600">
              The first image will be the cover (max 6)
            </span>
          </p>
          <form className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="border border-gray-300 p-3 rounded w-full"
              onChange={(evt) => setFiles(evt.target.files)}
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80 uppercase"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>
          <p className="text-red-600 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageURLs.length > 0 &&
            formData.imageURLs.map((url, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-24 h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  className=" text-red-700 p-3 hover:opacity-80"
                  onClick={() => handleDeleteImage(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="bg-slate-700 text-white p-3 rounded uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {err && <p className="text-sm text-red-600">{err}</p>}
        </div>
      </form>
    </main>
  );
};
export default CreateListing;
