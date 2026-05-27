export const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
};

export const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

export const getMonthName = (monthIndex) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return months[monthIndex];
};

export const getCalendarDays = (month, year) => {
    const days = [];
    const firstDay = getFirstDayOfMonth(month, year);
    const daysInMonth = getDaysInMonth(month, year);
    
    // Prev Month Days
    const prevMonthDate = new Date(year, month - 1, 1);
    const prevMonthDaysCount = getDaysInMonth(prevMonthDate.getMonth(), prevMonthDate.getFullYear());
    for (let i = firstDay - 1; i >= 0; i--) {
        const d = prevMonthDaysCount - i;
        const dDate = new Date(year, month - 1, d);
        days.push({
            day: d,
            dateStr: formatDate(dDate),
            isCurrentMonth: false
        });
    }

    // Current Month Days
    for (let d = 1; d <= daysInMonth; d++) {
        const dDate = new Date(year, month, d);
        days.push({
            day: d,
            dateStr: formatDate(dDate),
            isCurrentMonth: true
        });
    }

    // Next Month Days
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
        const dDate = new Date(year, month + 1, d);
        days.push({
            day: d,
            dateStr: formatDate(dDate),
            isCurrentMonth: false
        });
    }

    return days;
};
