/**
 * Professional Validation Utilities
 * Centralized logic for data integrity and real-time feedback.
 */

export const ValidationUtils = {
    // Patterns
    patterns: {
        phone: /^\d{10}$/, // Raw 10 digits
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        pan: /^[A-Z]{5}\d{4}[A-Z]{1}$/,
        aadhar: /^\d{12}$/,
        pincode: /^\d{6}$/
    },

    // Formatters
    formatters: {
        /**
         * Masks phone input to +91 XXXXX XXXXX
         */
        phone: (val) => {
            const raw = val.replace(/\D/g, '').slice(0, 10);
            if (raw.length <= 5) return raw;
            return `${raw.slice(0, 5)} ${raw.slice(5)}`;
        },

        /**
         * Unmasks phone for API submission (raw 10 digits)
         */
        unmaskPhone: (val) => val.replace(/\D/g, '').slice(-10)
    },

    // Validators (Returns error string or null if valid)
    validators: {
        phone: (val) => {
            const raw = val.replace(/\D/g, '');
            if (!raw) return "Phone number is required";
            if (raw.length !== 10) return "Phone number must be exactly 10 digits";
            return null;
        },

        email: (val) => {
            if (!val) return null; // Optional
            if (!ValidationUtils.patterns.email.test(val)) return "Please enter a valid email address";
            return null;
        },

        name: (val) => {
            if (!val || val.trim().length < 3) return "Full name must be at least 3 characters";
            if (/[0-9]/.test(val)) return "Name should not contain numbers";
            return null;
        },

        pan: (val) => {
            if (!val) return "PAN is required";
            if (!ValidationUtils.patterns.pan.test(val.toUpperCase())) return "Invalid PAN format (e.g. ABCDE1234F)";
            return null;
        },

        aadhar: (val) => {
            if (!val) return "Aadhar number is required";
            if (val.replace(/\s+/g, '').length !== 12) return "Aadhar must be exactly 12 digits";
            return null;
        },

        amount: (val) => {
            const num = parseFloat(val);
            if (isNaN(num) || num < 1) return "Minimum amount must be ₹1.00";
            return null;
        },

        date: (val, allowFuture = false) => {
            if (!val) return "Date is required";
            if (!allowFuture) {
                const selectedDate = new Date(val);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate > today) return "Future dates are not allowed for audit records";
            }
            return null;
        },

        bankAccount: (mode, accountId) => {
            if (['bank', 'upi', 'bank_transfer'].includes(mode) && !accountId) {
                return "Bank account is required for digital payments";
            }
            return null;
        }
    }
};
