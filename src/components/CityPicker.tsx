import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cookieStorageService } from "../services/cookie-storage.service";
import { tenantService } from "../services/tenant.service";

function getTenantsFromCookies(): any[] {
  const allTenantsJson = cookieStorageService.getItem("ALL_TENANTS");
  if (!allTenantsJson) return [];
  return allTenantsJson;
}

interface Props {
  onChange: (city: string, currentPath: string) => void;
  selectedCity?: string;
}

const CityPicker = ({ selectedCity, onChange }: Props) => {
  const [tenants,] = useState(getTenantsFromCookies());

  const location = useLocation();

  const handleSelect = (e: any) => {
    console.log('city changing 1');
    
    onChange(e.target.value, location.pathname);
  };

  return (
    <select onChange={handleSelect} value={selectedCity}>
      {tenants.map((c) => (
        <option key={c.code} value={c.code}>
          {c.name}
        </option>
      ))}
    </select>
  );
};

export default CityPicker;
