import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DevoteeService } from "../infrastructure/DevoteeService";

/**
 * Utility to extract DRF API validation errors
 */
function extractDRFError(e) {
    const data = e?.response?.data;
    if (!data) return "Something went wrong.";
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;
    if (typeof data === "object") {
        const k = Object.keys(data)[0];
        if (!k) return "Request failed.";
        const v = data[k];
        if (Array.isArray(v)) return v[0];
        if (typeof v === "string") return v;
    }
    return "Request failed.";
}

/**
 * Application Layer (Controller)
 * Isolates React State and Business Logic from generic views.
 */
export function useDevotees() {
    const { t } = useTranslation();

    // States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [searchField, setSearchField] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [ordering, setOrdering] = useState("-id");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [devotees, setDevotees] = useState([]);
    const [count, setCount] = useState(0);
    const [nakshatras, setNakshatras] = useState([]);

    const [tab, setTab] = useState("devotees");
    const [promoOpen, setPromoOpen] = useState(true);
    const [addOpen, setAddOpen] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [masterOpen, setMasterOpen] = useState(false);

    const [selected, setSelected] = useState(null);
    const [history, setHistory] = useState({ bookings: [], donations: [] });
    const [historyLoading, setHistoryLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        full_name: "", phone: "", email: "", nakshatra: "",
        address: "", id_proof_type: "", id_proof_number: "", id_proof_file: null,
    });
    const [masterForm, setMasterForm] = useState({ name: "" });

    const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

    const fetchMasters = useCallback(async () => {
        try {
            const data = await DevoteeService.getNakshatras();
            setNakshatras(data);
        } catch (e) {
            console.error("Failed to load nakshatras");
        }
    }, []);

    const fetchDevotees = useCallback(async () => {
        if (tab !== "devotees") return;
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams({ ordering, page, page_size: pageSize });
            if (search) {
                if (searchField === "id") params.append("id", search);
                else if (searchField === "phone") params.append("phone", search);
                else if (searchField === "email") params.append("email", search);
                else params.append("search", search);
            }
            if (dateFilter === "last_30") {
                const d = new Date();
                d.setDate(d.getDate() - 30);
                params.append("created_at_after", d.toISOString().split('T')[0]);
            }

            const { data, count: total } = await DevoteeService.getDevotees(params);
            setDevotees(data);
            setCount(total);
        } catch (e) {
            setError(t('failed_to_load_devotees', "Failed to load devotees"));
        } finally {
            setLoading(false);
        }
    }, [page, search, searchField, ordering, dateFilter, tab, t]);

    const saveMaster = async () => {
        if (!masterForm.name.trim()) return setError(t('name_required', "Name is required"));
        try {
            if (editingId && tab === "nakshatras") {
                await DevoteeService.updateNakshatra(editingId, { name: masterForm.name });
            } else {
                await DevoteeService.createNakshatra({ name: masterForm.name });
            }
            setMasterOpen(false);
            setMasterForm({ name: "" });
            setEditingId(null);
            fetchMasters();
        } catch (e) {
            setError(t('action_failed', "Action failed. Record might exist or system is busy."));
        }
    };

    const deleteDevotee = async (id) => {
        if (!window.confirm(t('confirm_delete', "Are you sure you want to deactivate this record?"))) return;
        try {
            await DevoteeService.deleteDevotee(id);
            fetchDevotees();
        } catch (e) {
            setError(t('delete_failed', "Failed to delete. Active dependencies might exist."));
        }
    };

    const deleteMaster = async (id) => {
        if (!window.confirm(t('confirm_delete_master', "Are you sure? This cannot be undone."))) return;
        try {
            await DevoteeService.deleteNakshatra(id);
            fetchMasters();
        } catch (e) {
            setError(t('delete_failed', "Failed to delete record."));
        }
    };

    const resetForm = () => {
        setForm({ full_name: "", phone: "", email: "", nakshatra: "", address: "", id_proof_type: "", id_proof_number: "", id_proof_file: null });
        setEditingId(null);
        setError("");
    };

    const onAddClick = () => {
        resetForm();
        setAddOpen(true);
    };

    const onEditClick = (devotee) => {
        setForm({
            full_name: devotee.full_name || "",
            phone: devotee.phone || "",
            email: devotee.email || "",
            nakshatra: devotee.nakshatra?.id || devotee.nakshatra || "",
            address: devotee.address || "",
            id_proof_type: devotee.id_proof_type || "",
            id_proof_number: devotee.id_proof_number || "",
            id_proof_file: null,
        });
        setEditingId(devotee.id);
        setAddOpen(true);
    };

    const saveDevotee = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.full_name.trim()) return setError(t('full_name_required', "Full name is required"));
        if (!form.phone.trim()) return setError(t('phone_required', "Phone is required"));

        const formData = new FormData();
        formData.append("full_name", form.full_name);
        formData.append("phone", form.phone);
        if (form.email) formData.append("email", form.email);
        if (form.nakshatra) formData.append("nakshatra", form.nakshatra);
        if (form.address) formData.append("address", form.address);
        if (form.id_proof_type) formData.append("id_proof_type", form.id_proof_type);
        if (form.id_proof_number) formData.append("id_proof_number", form.id_proof_number);
        if (form.id_proof_file instanceof File) formData.append("id_proof_file", form.id_proof_file);

        try {
            if (editingId) {
                await DevoteeService.updateDevotee(editingId, formData);
            } else {
                await DevoteeService.createDevotee(formData);
            }
            setAddOpen(false);
            resetForm();
            if (!editingId) setPage(1);
            fetchDevotees();
        } catch (e) {
            setError(extractDRFError(e));
        }
    };

    const openHistory = async (devotee) => {
        setSelected(devotee);
        setHistoryOpen(true);
        setHistoryLoading(true);
        try {
            const data = await DevoteeService.getDevoteeHistory(devotee.id);
            setHistory(data);
        } catch (e) {
            console.error(e);
        } finally {
            setHistoryLoading(false);
        }
    };

    const onDownload = async (type) => {
        try {
            const data = await DevoteeService.exportDevotees(type);
            const url = window.URL.createObjectURL(new Blob([data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = `devotees.${type === 'excel' ? 'xlsx' : type}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            setDownloadMenuOpen(false);
        } catch (e) {
            setError(t('download_failed', "Download failed. Please try again."));
        }
    };

    const totalPages = useMemo(() => (count ? Math.max(1, Math.ceil(count / pageSize)) : 1), [count, pageSize]);
    const proofsCount = useMemo(() => devotees.filter((d) => !!d.id_proof_type).length, [devotees]);

    return {
        state: {
            loading, error, search, searchField, dateFilter, ordering, page, pageSize, count,
            devotees, nakshatras, tab, promoOpen, addOpen, historyOpen, masterOpen, selected,
            history, historyLoading, editingId, form, masterForm, downloadMenuOpen, totalPages, proofsCount
        },
        actions: {
            setSearch, setSearchField, setDateFilter, setOrdering, setPage, setTab,
            setPromoOpen, setAddOpen, setHistoryOpen, setMasterOpen, setForm, setMasterForm,
            setDownloadMenuOpen, fetchMasters, fetchDevotees, saveMaster, saveDevotee,
            onAddClick, onEditClick, openHistory, onDownload, setError,
            deleteDevotee, deleteMaster
        }
    };
}
