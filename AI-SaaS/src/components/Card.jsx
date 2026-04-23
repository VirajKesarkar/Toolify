import React from "react";
import { download } from "../../assets";
import { downloadImage } from "../../utils/downloadImage";

export default function Card({ _id, name, prompt, model, photo }) {
  return (
    <div className="rounded-xl shadow-lg overflow-hidden relative group">
      <img src={photo} alt={prompt} className="w-full rounded-xl" />

      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 hidden group-hover:block">
        <p className="text-white">{prompt}</p>

        <div className="flex items-center justify-between mt-3">
          <p className="text-white">{name}</p>
          <button onClick={() => downloadImage(_id, photo)}>
            <img src={download} className="w-6 invert" />
          </button>
        </div>
      </div>
    </div>
  );
}
