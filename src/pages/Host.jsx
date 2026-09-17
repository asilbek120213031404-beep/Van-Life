import { NavLink } from "react-router-dom";

export default function Host() {
    const activeStyle = "font-bold underline text-[rgba(247,94,5,1)]";
    const normalStyle = "font-medium text-gray-700 hover:text-black transition";

    return (
        <nav className="flex items-center justify-start gap-6 sm:gap-8 px-6 sm:px-8 py-6 bg-[rgba(255,247,237,1)] border-b border-orange-100">
            <NavLink
                to="."
                end
                className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
            >
                Dashboard
            </NavLink>
            <NavLink
                to="income"
                className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
            >
                Income
            </NavLink>
            <NavLink
                to="hostVans"
                className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
            >
                Vans
            </NavLink>
            <NavLink
                to="reviews"
                className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
            >
                Reviews
            </NavLink>
        </nav>
    );
}