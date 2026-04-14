import api from "../../../shared/api/client";

/**
 * Data Access Layer (Clean Architecture: Infrastructure)
 * Handles all API communication for Devotees and Nakshatras.
 */
export const DevoteeService = {
    async getDevotees(params) {
        const res = await api.get(`/devotees/`, { params });
        // Normalize response structure
        return {
            data: Array.isArray(res.data) ? res.data : res.data.results || [],
            count: res.data?.count || (Array.isArray(res.data) ? res.data.length : 0)
        };
    },

    async createDevotee(formData) {
        return api.post("/devotees/", formData, { headers: { "Content-Type": "multipart/form-data" } });
    },

    async updateDevotee(id, formData) {
        return api.patch(`/devotees/${id}/`, formData, { headers: { "Content-Type": "multipart/form-data" } });
    },

    async getNakshatras() {
        const res = await api.get("/devotees/nakshatra/");
        return Array.isArray(res.data) ? res.data : res.data.results || [];
    },

    async createNakshatra(payload) {
        return api.post("/devotees/nakshatra/", payload);
    },

    async getDevoteeHistory(id) {
        const res = await api.get(`/devotees/${id}/details/`);
        return {
            bookings: res.data.bookings || [],
            donations: res.data.donations || []
        };
    },

    async deleteDevotee(id) {
        return api.delete(`/devotees/${id}/`);
    },

    async updateNakshatra(id, payload) {
        return api.patch(`/devotees/nakshatra/${id}/`, payload);
    },

    async deleteNakshatra(id) {
        return api.delete(`/devotees/nakshatra/${id}/`);
    },

    async exportDevotees(format) {
        const res = await api.get(`/devotees/export/${format}/`, { responseType: "blob" });
        return res.data;
    }
};
