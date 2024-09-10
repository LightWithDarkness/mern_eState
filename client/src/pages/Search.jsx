import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";

const Search = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [formData, setFormData] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    parking: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
  });
  //
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm") || "";
    const type = urlParams.get("type") || "all";
    const offer = urlParams.get("offer") === "true" || false;
    const parking = urlParams.get("parking") === "true" || false;
    const furnished = urlParams.get("furnished") === "true" || false;
    const sort = urlParams.get("sort") || "createdAt";
    const order = urlParams.get("order") || "desc";
    setFormData({
      searchTerm,
      type,
      offer,
      parking,
      furnished,
      sort,
      order,
    });

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchParams = urlParams.toString();
      try {
        const res = await fetch(`/api/v1/listing/search?${searchParams}`);
        const data = await res.json();
        setLoading(false);
        if (data.success === false) {
          return console.log(data.message);
        }
        if (data?.listings?.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setListings(data.listings);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const onShowMoreClick = async () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIdx", listings?.length || 0);
    try {
      const searchParams = urlParams.toString();
      const res = await fetch(`/api/v1/listing/search?${searchParams}`);
      const data = await res.json();
      setListings([...listings, ...data.listings]);
      data.listings?.length > 8 ? setShowMore(true) : setShowMore(false);
    } catch (error) {
      return console.log(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", formData.searchTerm);
    urlParams.set("type", formData.type);
    urlParams.set("offer", formData.offer);
    urlParams.set("parking", formData.parking);
    urlParams.set("furnished", formData.furnished);
    urlParams.set("sort", formData.sort);
    urlParams.set("order", formData.order);
    const url = urlParams.toString();
    // console.log(url);
    navigate(`/search?${url}`);
  };
  const handleChange = (evt) => {
    if (
      evt.target.id === "all" ||
      evt.target.id === "rent" ||
      evt.target.id === "sale"
    ) {
      setFormData({ ...formData, type: evt.target.id });
    }
    if (evt.target.id === "searchTerm") {
      setFormData({ ...formData, searchTerm: evt.target.value });
    }
    if (
      evt.target.id === "offer" ||
      evt.target.id === "parking" ||
      evt.target.id === "furnished"
    ) {
      setFormData({
        ...formData,
        [evt.target.id]:
          evt.target.checked || evt.target.checked === "true" ? true : false,
      });
    }
    if (evt.target.id === "sort_order") {
      const [sort, order] = evt.target.value.split("_");
      console.log(sort, order);
      setFormData({ ...formData, sort, order });
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSearch} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={formData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-4"
                checked={formData.type === "all"}
                onChange={handleChange}
              />
              <label htmlFor="">Rent & Sale</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-4"
                checked={formData.type === "rent"}
                onChange={handleChange}
              />
              <label htmlFor="">Rent</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-4"
                checked={formData.type === "sale"}
                onChange={handleChange}
              />
              <label htmlFor="">Sale</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-4"
                checked={formData.offer}
                onChange={handleChange}
              />
              <label htmlFor="">Offer</label>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-4"
                checked={formData.parking}
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div>
              <input
                type="checkbox"
                id="furnished"
                className="w-4"
                checked={formData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
              <option value="discountPrice_desc">Price high to low</option>
              <option value="discountPrice_asc">Price low to hight</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>

        <div className="p-7 flex flex-wrap gap-4">
          {loading ? (
            <p className="text-2xl text-slate-500 text-center">Loading...</p>
          ) : listings && listings.length < 1 ? (
            <p className="text-2xl text-slate-500 text-center">
              No Listing Found
            </p>
          ) : (
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))
          )}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Search;
