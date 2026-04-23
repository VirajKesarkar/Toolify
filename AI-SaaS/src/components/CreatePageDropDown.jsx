export default function CreatePageDropDown({ data, form, setForm }) {
  return (
    <select
      className="border p-2 rounded"
      value={form.model}
      onChange={(e) => setForm({ ...form, model: e.target.value })}
    >
      {data.map((model) => (
        <option key={model} value={model}>
          {model}
        </option>
      ))}
    </select>
  );
}
