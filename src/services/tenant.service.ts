import { apiService } from "./api.service";

export const tenantService = {
  getAllTenants,
};

function getAllTenants() {
    return apiService.get<any[]>("Tenants", "Active/ListItems")
        .then(tenants => (tenants.map(t => ({code: t.key, name: t.value}))));
}
