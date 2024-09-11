import React from "react";

const About = () => {
  return (
    <main>
      <div className="py-20 px-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-slate-800">
          About Kumar Estate
        </h1>
        <p className="mb-4 text-slate-700">
          Welcome to <span className="font-bold">Kumar Estate</span>, your
          trusted platform for property listings, whether you're looking to buy,
          sell, or rent. We aim to make the real estate experience seamless,
          transparent, and efficient for everyone.
        </p>
        <p className="mb-4 text-slate-700">
          Our platform connects property owners and prospective buyers or
          tenants through a user-friendly interface, offering a wide variety of
          residential and commercial properties. Whether you’re a property owner
          looking to list or a buyer in search of the perfect home, Kumar Estate
          is here to make the process simpler.
        </p>
        <p className="mb-4 text-slate-700">
          Our team of agents has a wealth of experience and knowledge in the
          real estate industry, and we are committed to providing the highest
          level of service to our clients. We believe that buying or selling a
          property should be an exciting and rewarding experience, and we are
          dedicated to making that a reality for each and every one of our
          clients.
        </p>

        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Why Choose Kumar Estate?
          </h2>
          <ul className="list-disc list-inside space-y-2 mb-4 text-slate-700">
            <li>
              <span className="font-semibold">Comprehensive Listings:</span>{" "}
              Browse through detailed property listings that include photos,
              prices, and key details like the number of bedrooms, bathrooms,
              and parking spaces.
            </li>
            <li>
              <span className="font-semibold">Advanced Search & Filters:</span>{" "}
              Use our advanced filtering options to find exactly what you’re
              looking for. Filter by price, location, type of property
              (rent/sale), furnished status, and more.
            </li>
            <li>
              <span className="font-semibold">User-Friendly Interface:</span>{" "}
              Our platform is designed to be simple and intuitive for all users.
              From browsing listings to getting in touch with property owners,
              the process is easy and efficient.
            </li>
            <li>
              <span className="font-bold">Secure and Trusted:</span> We
              prioritize security and trust by using cookie-based sessions,
              JWT-based authentication, and password hashing to keep your
              information safe.
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <h2 className="text-[1.4rem] font-semibold mb-1 text-slate-800">
            Our Mission
          </h2>
          <p className="text-lg">
            At <span className="font-semibold">Kumar Estate</span>, our mission
            is to streamline the property search and listing process by offering
            a secure and efficient platform. Whether you’re a first-time buyer
            or an experienced seller, we strive to provide a transparent and
            hassle-free experience.
          </p>
        </div>
        <div>
          <h2 className="text-[1.4rem] font-semibold mb-1 text-slate-800">
            Our Technology
          </h2>
          <p className="text-lg">
            We leverage cutting-edge technologies such as{" "}
            <span className="font-semibold">React</span>,{" "}
            <span className="font-semibold">Node.js</span>,{" "}
            <span className="font-semibold">Express.js</span>,{" "}
            <span className="font-semibold">MongoDB</span>, and{" "}
            <span className="font-semibold">Tailwind CSS</span> to deliver a
            fast, responsive, and seamless user experience across all devices.
            Our back-end is designed with security and scalability in mind,
            ensuring smooth communication between users and the platform.
          </p>
        </div>
      </div>
    </main>
  );
};

export default About;
