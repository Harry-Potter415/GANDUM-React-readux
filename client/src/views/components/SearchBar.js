import React, { useState, useEffect } from "react";
import DatePicker from "react-date-picker";

export default function SearchBar({ data, fields, onQuery }) {
  const [filter, setFilter] = useState({});
  const [dFrom, setDFrom] = useState();
  const [dTo, setDTo] = useState();
  console.log("search bar data", data);
  useEffect(() => {
    let queried = data.filter((datum) => {
      for (let field of fields) {
        if (!filter[field]) continue;

        if (
          datum[field]?.toLowerCase().search(filter[field].toLowerCase()) == -1
        ) {
          return false;
        }
      }
      return true;
    });
    if (dFrom)
      queried = queried.filter((datum) => new Date(datum.date) >= dFrom);
    if (dTo) queried = queried.filter((datum) => new Date(datum.date) <= dTo);
    onQuery(queried);
    console.log(filter);
  }, [filter, dTo, dFrom]);
  return (
    <div style={{ padding: "1rem" }}>
      {/* <select onInput={(e) => setField(e.target.value)}>
        {fields?.map((_field) => (
          <option value={_field}>{_field}</option>
        ))}
      </select> */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem",
        }}
      >
        {fields?.map((_field) => (
          <input
            style={{
              padding: "0.5rem 1rem",
              margin: "0.25rem 0rem",
            }}
            placeholder={"Search by " + _field}
            type="text"
            value={filter[_field]}
            onInput={(e) => {
              setFilter({ ...filter, [_field]: e.target.value });
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "1fr 3fr 1fr 3fr",
        }}
      >
        <span>From</span>
        <DatePicker
          style={{ position: "fixed", zIndex: "3" }}
          onChange={setDFrom}
          value={dFrom}
        />
        <span>To</span>
        <DatePicker
          style={{ position: "fixed" }}
          onChange={setDTo}
          value={dTo}
        />
      </div>
    </div>
  );
}
