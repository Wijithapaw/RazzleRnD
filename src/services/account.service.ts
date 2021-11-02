import { apiService } from "./api.service";

export const accountService = {
  getRelatedTenants,
};

function getRelatedTenants(userId: string) {
  return apiService
    .get<any[]>("Account", "RelatedTenants", undefined, { userId })
    .then((tenants) => tenants.map((t) => ({ code: t.key, name: t.value })));
}
