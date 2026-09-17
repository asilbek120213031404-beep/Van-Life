import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import supabase from "../lib/supabaseClient";

export default function Header() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeBookingCount, setActiveBookingCount] = useState(0);

    const activeStyle = "font-bold text-[rgba(247,94,5,1)] underline";
    const normalStyle = "font-medium text-gray-800 hover:text-[rgba(247,94,5,1)] transition";

    const ADMIN_EMAIL = "mrasilbek3@gmail.com";
    const isAdmin = isAuthenticated && user?.email === ADMIN_EMAIL;

    useEffect(() => {
        async function checkActiveBookings() {
            if (!isAuthenticated || !user) {
                setActiveBookingCount(0);
                return;
            }

            const { data, error } = await supabase
                .from("bookings")
                .select("id")
                .eq("user_id", user.id)
                .eq("status", "confirmed");

            if (!error && data) {
                setActiveBookingCount(data.length);
            } else {
                setActiveBookingCount(0);
            }
        }

        checkActiveBookings();

        window.addEventListener("booking-updated", checkActiveBookings);
        return () => window.removeEventListener("booking-updated", checkActiveBookings);
    }, [isAuthenticated, user]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (err) {
            console.error("Logout xatosi:", err);
        }
    };

    return (
        <header className="flex flex-wrap items-center justify-between w-full px-4 py-4 sm:px-8 sm:py-6 bg-[rgba(255,247,237,1)] border-b border-orange-100 gap-3">
            <Link to="/" className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 hover:text-[rgba(247,94,5,1)] transition">
                #VANLIFE
            </Link>
            <nav className="flex items-center gap-2.5 sm:gap-6 text-xs sm:text-sm md:text-base flex-wrap">
                {/* Only render Host link if logged in user is admin */}
                {isAdmin && (
                    <NavLink to="/host" className={({ isActive }) => (isActive ? activeStyle : normalStyle)}>
                        Host
                    </NavLink>
                )}

                {/* Show "My Van" button if user has at least 1 active rental */}
                {activeBookingCount > 0 && (
                    <NavLink to="/my-van" className={({ isActive }) => (isActive ? activeStyle : normalStyle)}>
                        My Van
                    </NavLink>
                )}

                <NavLink to="/about" className={({ isActive }) => (isActive ? activeStyle : normalStyle)}>
                    About
                </NavLink>
                <NavLink to="/vans" className={({ isActive }) => (isActive ? activeStyle : normalStyle)}>
                    Vans
                </NavLink>

                {isAuthenticated ? (
                    <button
                        onClick={handleLogout}
                        className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition cursor-pointer"
                    >
                        Chiqish
                    </button>
                ) : (
                    <NavLink to="/login" className={({ isActive }) => (isActive ? activeStyle : normalStyle)}>
                        Login
                    </NavLink>
                )}
            </nav>
        </header>
    );
}