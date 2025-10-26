import React from 'react';

const Footer: React.FC = () => {
    const today = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const formattedDate = today.toLocaleDateString('vi-VN', dateOptions);

    // Capitalize the first letter of the weekday
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    return (
        <footer className="w-full text-center py-4 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-slate-100">
            <p className="text-sm text-slate-500">
                {capitalizedDate}
            </p>
            <p className="text-sm text-slate-500 mt-1">
                © 2025 Học Tiếng Anh Cùng AI. Phát triển bởi Long Nguyễn.
            </p>
        </footer>
    );
};

export default Footer;
