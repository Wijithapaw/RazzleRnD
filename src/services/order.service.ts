import { apiService } from "./api.service";

export const orderService = {
  getLatest10Orders,
  getPricingMatrix,
};

function getLatest10Orders() {
  const filter = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: "CreatedDateUtc",
    ascending: false,
    activeOrdersOnly: true,
  };
  return apiService.get("orders", "listOrders", undefined, filter);
}

function getPricingMatrix() {
  return apiService.get("ordermetadata", "PackagePricingMatrixGroups");
}
