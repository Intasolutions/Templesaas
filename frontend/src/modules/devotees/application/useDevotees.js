import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DevoteeService } from "../infrastructure/DevoteeService";
import { useNotify, useConfirm } from "../../../context/NotificationContext";
import { ValidationUtils } from "../../../shared/utils/ValidationUtils";

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
    const notify = useNotify();
    const confirmDialog = useConfirm();

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
    const [stats, setStats] = useState({ this_month: 0, trend: 0, verified: 0 });
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
        family_head: ""
    });
    const [formErrors, setFormErrors] = useState({});
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

    const fetchStats = useCallback(async () => {
        try {
            const data = await DevoteeService.getStats();
            setStats(data);
        } catch (e) {
            console.error("Failed to load stats");
        }
    }, []);

    const fetchDevotees = useCallback(async () => {
        if (tab !== "devotees") return;
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams({ ordering, page, page_size: pageSize, is_trust_member: 'true' });
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
            fetchStats();
        } catch (e) {
            setError(t('failed_to_load_devotees', "Failed to load devotees"));
        } finally {
            setLoading(false);
        }
    }, [page, search, searchField, ordering, dateFilter, tab, t]);

    const saveMaster = async () => {
        const errors = {
            name: ValidationUtils.validators.name(masterForm.name)
        };
        const hasErrors = Object.values(errors).some(v => !!v);
        
        if (hasErrors) {
            setFormErrors(errors);
            return notify.warn(t('fix_errors', "Please correct the highlighted errors."));
        }

        try {
            if (editingId && tab === "nakshatras") {
                await DevoteeService.updateNakshatra(editingId, { 
                    name: masterForm.name,
                    name_ml: masterForm.name_ml 
                });
            } else {
                await DevoteeService.createNakshatra({ 
                    name: masterForm.name,
                    name_ml: masterForm.name_ml 
                });
            }
            setMasterOpen(false);
            setMasterForm({ name: "", name_ml: "" });
            setEditingId(null);
            setFormErrors({});
            fetchMasters();
            notify.success(editingId ? t('master_updated', 'Master record updated') : t('master_created', 'Master record created'));
        } catch (e) {
            notify.error(extractDRFError(e));
        }
    };

    const deleteDevotee = async (id) => {
        confirmDialog({
            title: t('deactivate_member', 'Deactivate Member'),
            message: t('confirm_deactivate_msg', 'Are you sure you want to deactivate this trust member? This action is reversible by an administrator.'),
            confirmText: 'Deactivate',
            onConfirm: async () => {
                try {
                    await DevoteeService.deleteDevotee(id);
                    notify.success(t('member_deactivated', 'Member deactivated successfully'));
                    fetchDevotees();
                } catch (e) {
                    notify.error(t('delete_failed', "Failed to deactivate record. Active dependencies might exist."));
                }
            }
        });
    };

    const deleteMaster = async (id) => {
        confirmDialog({
            title: t('delete_master', 'Delete Master Record'),
            message: t('confirm_delete_master_msg', 'Are you sure? This action cannot be undone and may affect associated records.'),
            confirmText: 'Delete Forever',
            onConfirm: async () => {
                try {
                    await DevoteeService.deleteNakshatra(id);
                    notify.success(t('master_deleted', 'Master record deleted'));
                    fetchMasters();
                } catch (e) {
                    notify.error(t('delete_failed', "Failed to delete record."));
                }
            }
        });
    };

    const resetForm = () => {
        setForm({ full_name: "", phone: "", email: "", nakshatra: "", address: "", id_proof_type: "", id_proof_number: "", id_proof_file: null, family_head: "" });
        setFormErrors({});
        setEditingId(null);
        setError("");
    };

    const onAddClick = () => {
        resetForm();
        setAddOpen(true);
    };

    const onAddMasterClick = () => {
        setEditingId(null);
        setMasterForm({ name: "" });
        setError("");
        setMasterOpen(true);
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
            is_trust_member: devotee.is_trust_member || false,
            family_head: devotee.family_head || ""
        });
        setEditingId(devotee.id);
        setFormErrors({});
        setAddOpen(true);
    };

    const updateForm = (key, val) => {
        let finalVal = val;
        let error = null;

        if (key === 'phone') {
            finalVal = ValidationUtils.formatters.phone(val);
            error = ValidationUtils.validators.phone(finalVal);
        } else if (key === 'full_name') {
            error = ValidationUtils.validators.name(val);
        } else if (key === 'email') {
            error = ValidationUtils.validators.email(val);
        } else if (key === 'id_proof_number') {
            if (form.id_proof_type === 'pan') error = ValidationUtils.validators.pan(val);
            if (form.id_proof_type === 'aadhar') error = ValidationUtils.validators.aadhar(val);
        }

        setForm(prev => ({ ...prev, [key]: finalVal }));
        setFormErrors(prev => ({ ...prev, [key]: error }));
    };

    const saveDevotee = async (e) => {
        if (e) e.preventDefault();
        setError("");

        // Final Validation Check
        const errors = {
            full_name: ValidationUtils.validators.name(form.full_name),
            phone: ValidationUtils.validators.phone(form.phone)
        };
        if (form.id_proof_type === 'pan') errors.id_proof_number = ValidationUtils.validators.pan(form.id_proof_number);
        if (form.id_proof_type === 'aadhar') errors.id_proof_number = ValidationUtils.validators.aadhar(form.id_proof_number);

        const hasErrors = Object.values(errors).some(v => !!v);
        if (hasErrors) {
            setFormErrors(errors);
            return notify.warn(t('fix_errors', "Please correct the highlighted errors before saving."));
        }

        const formData = new FormData();
        formData.append("full_name", form.full_name);
        formData.append("phone", ValidationUtils.formatters.unmaskPhone(form.phone));
        if (form.email) formData.append("email", form.email);
        if (form.nakshatra) formData.append("nakshatra", form.nakshatra);
        if (form.address) formData.append("address", form.address);
        if (form.id_proof_type) formData.append("id_proof_type", form.id_proof_type);
        if (form.id_proof_number) formData.append("id_proof_number", form.id_proof_number);
        if (form.id_proof_file instanceof File) formData.append("id_proof_file", form.id_proof_file);
        if (form.family_head) formData.append("family_head", form.family_head);
        formData.append("is_trust_member", "true"); // Always true when adding from this management page

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
            notify.success(editingId ? t('member_updated', 'Member details updated') : t('member_added', 'New member added to trust'));
        } catch (e) {
            notify.error(extractDRFError(e));
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

    const dynamicPageSize = tab === 'nakshatras' ? 50 : 10;
    const totalPages = useMemo(() => (count ? Math.max(1, Math.ceil(count / dynamicPageSize)) : 1), [count, dynamicPageSize]);
    const proofsCount = useMemo(() => devotees.filter((d) => !!d.id_proof_type).length, [devotees]);

    return {
        state: {
            loading, error, search, searchField, dateFilter, ordering, page, pageSize, count,
            devotees, nakshatras, tab, promoOpen, addOpen, historyOpen, masterOpen, selected,
            history, historyLoading, editingId, form, formErrors, masterForm, downloadMenuOpen, totalPages, proofsCount, stats
        },
        actions: {
            setSearch, setSearchField, setDateFilter, setOrdering, setPage, setTab,
            setPromoOpen, setAddOpen, setHistoryOpen, setMasterOpen, setForm, updateForm, setMasterForm,
            setEditingId, setDownloadMenuOpen, fetchMasters, fetchDevotees, saveMaster, saveDevotee,
            onAddClick, onAddMasterClick, onEditClick, openHistory, onDownload, setError,
            deleteDevotee, deleteMaster
        }
    };
}
