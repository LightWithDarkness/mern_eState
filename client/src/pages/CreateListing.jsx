const CreateListing = () => {
  return (
    <main className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl font-bold my-7 text-center">Create a Listing</h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            maxLength="62"
            minLength="10"
            required
            className=" border p-3 rounded-lg"
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            required
            className=" border p-3 rounded-lg"
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            required
            className=" border p-3 rounded-lg"
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-4" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-4" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-4" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-4" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-4" />
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
                value="1"
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
                value="1"
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
                value="0"
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="500"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                value="0"
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images: <span className="font-normal text-gray-600">The first image will be the cover (max 6)</span>
          </p>
          <form className="flex gap-4">
            <input type="file" id="images" accept="image/*" multiple className="border border-gray-300 p-3 rounded w-full"/>
            <button className="p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80 uppercase">Upload</button>
          </form>
          <button className="bg-slate-700 text-white p-3 rounded uppercase hover:opacity-95 disabled:opacity-80">Create Listing</button>
        </div>
      </form>
    </main>
  );
};
export default CreateListing;
