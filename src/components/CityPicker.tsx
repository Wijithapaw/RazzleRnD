import React from "react";
import { useLocation } from "react-router-dom";

export const cities = [
  { code: "LON", name: "London" },
  { code: "COL", name: "Colombo" },
  { code: "GALLE", name: "Galle" },
];

interface Props {
  onChange: (city: string, currentPath: string) => void;
  selectedCity?: string;
}

const CityPicker = ({ selectedCity, onChange }: Props) => {
  const location = useLocation();

  const handleSelect = (e: any) => {
    onChange(e.target.value, location.pathname);
  };

  return (
    <select onChange={handleSelect} value={selectedCity}>
      {cities.map((c) => (
        <option key={c.code} value={c.code}>
          {c.name}
        </option>
      ))}
    </select>
  );
};

export default CityPicker;
