import React from "react";

export default function FormField({
  labelName,
  type,
  name,
  placeholder,
  value,
  handleChange,
  isSurpriseMe,
  handleSurpriseMe,
}) {
  return (
    <div className="mb-4">
      <label className="font-medium block mb-1">{labelName}</label>

      {isSurpriseMe && (
        <button
          type="button"
          onClick={handleSurpriseMe}
          className="text-sm text-blue-600 underline"
        >
          Surprise Me
        </button>
      )}

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className="border p-3 w-full rounded-md"
      />
    </div>
  );
}
