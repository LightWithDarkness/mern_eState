import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [message, setMessage] = useState("");
  const [landLord, setLandlord] = useState(null);
  useEffect(() => {
    const getLandlord = async () => {
      try {
        const response = await fetch(`/api/v1/user/${listing.userId}`);
        const data = await response.json();
        if (!data.success) {
          return console.log("err: ", data.message);
        }
        setLandlord(data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getLandlord();
  }, []);
  return (
    <>
      {landLord && (
        <div className=" mt-6 flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landLord?.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className="w-full border outline-none p-3 rounded-lg"
            rows="3"
            id="message"
            placeholder="Enter Your Message.."
            value={message}
            onChange={(evt) => setMessage(evt.target.value)}
          />
          <Link
            to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};
export default Contact;
