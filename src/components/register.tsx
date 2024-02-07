import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormComponent: React.FC = () => {
  const [formData, setFormData] = useState({ name: "" });
  const apiUrl = `${process.env.REACT_APP_SERVER_DOMAIN}`;
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("battleshipUser")) {
      navigate("/align-ships");
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // This will create a record in the lead board
    const response = await axios
      .post(`${apiUrl}/api/register`, { name: formData.name })
      .then((data) => {
        console.log("Success:", data);
        localStorage.setItem("battleshipUser", JSON.stringify(data.data));
        navigate("/align-ships");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="align-middle block h-[300px] mt-[15%] text-center">
      <p className="text-[40px] font-semibold mb-12 mt-12 text-center">
        Register user!
      </p>
      <form onSubmit={handleSubmit} className="inline-block">
        <label>
          <input
            placeholder="Enter your name"
            className="rounded-md border-slate-500 border-solid border-2 mr-4 p-4 w-[500px] text-[24px] text-gray-600"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded inline-flex items-center transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-110 text-[24px]"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormComponent;
