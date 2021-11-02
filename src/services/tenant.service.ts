export const tenantService = {
  getAllTenants,
};

function getAllTenants() {
  const cities = [
    { code: "LON", name: "London" },
    { code: "COL", name: "Colombo" },
    { code: "GALLE", name: "Galle" },
  ];

  return Promise.resolve(cities);
}
