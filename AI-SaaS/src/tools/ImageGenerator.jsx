import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Components
import FormField from "../components/FormField.jsx";
import Loader from "../components/Loader.jsx";
import CreatePageDropDown from "../components/CreatePageDropDown.jsx";

// Assets & Utils
import preview from "../assets/preview.png";
import { getRandomPrompt } from "../utils/getRandomPrompt.js";
import { BiSolidError } from "react-icons/bi";

export default function ImageGenerator() {
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
    model: "stable-diffusion-v1-5",
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [errorHandler, setErrorHandler] = useState({
    isError: false,
    status: "",
  });

  const models = ["stable-diffusion-v1-5", "stable-diffusion-xl-base-1.0"];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    setForm({ ...form, prompt: getRandomPrompt(form.prompt) });
  };

  // 🎨 Generate Image
  const generateImage = async () => {
    if (!form.prompt) return toast.error("Please enter a prompt");

    setGeneratingImg(true);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/dalle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: form.prompt, model: form.model }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorHandler({ isError: true, status: data.status || "500" });
        return toast.error("Image generation failed");
      }

      setForm({ ...form, photo: data.image });
      setErrorHandler({ isError: false, status: "" });
    } catch (err) {
      toast.error("Could not reach backend server");
    }

    setGeneratingImg(false);
  };

  // ⬇️ Download Image
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = form.photo;
    link.download = "ai-generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="max-w-7xl mx-auto py-14 px-6 text-white">
      {/* 🔥 Title */}
      <h1 className="text-center text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
        AI Image Generator
      </h1>

      <p className="text-center text-gray-400 mt-2 text-lg">
        Generate stunning visuals with the power of AI
      </p>

      {/* 🌟 Two Column Layout */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* 📝 Form Column */}
        <form className="max-w-lg space-y-6 mx-auto">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A futuristic cyberpunk city in neon lights..."
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          {/* 🛠 Model Selector */}
          <div className="flex flex-col">
            <label className="text-indigo-300 font-medium mb-1">Model:</label>
            <CreatePageDropDown
              data={models}
              form={form}
              setForm={setForm}
              handleChange={handleChange}
            />
          </div>

          {/* 🔘 Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={generateImage}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-lime-500 text-black font-semibold rounded-lg hover:scale-105 transition-transform shadow-lg"
            >
              {generatingImg ? "Generating..." : "Generate"}
            </button>

            {form.photo && !generatingImg && (
              <button
                type="button"
                onClick={downloadImage}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform shadow-lg"
              >
                Download
              </button>
            )}
          </div>
        </form>

        {/* 🖼 Preview Column */}
        <div className="flex justify-center">
          <div className="relative bg-[#0e1330] border border-indigo-600/40 shadow-xl shadow-indigo-900/40 rounded-xl w-[500px] h-[500px] flex items-center justify-center backdrop-blur-md">

            {errorHandler.isError ? (
              <div className="text-center text-red-400">
                <BiSolidError className="text-6xl mx-auto" />
                <p className="text-lg mt-2">Error generating image</p>
                <p className="text-sm">Error Code: {errorHandler.status}</p>
              </div>
            ) : form.photo ? (
              <img
                src={form.photo}
                alt="generated"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-2/3 opacity-20"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 bg-black/50 flex justify-center items-center rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
