import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import supabase from "../lib/supabaseClient";

export default function HostVan() {
    const { id } = useParams();

    const [hostVan, setHostVan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const activeStyle = "font-bold underline text-[rgba(247,94,5,1)]";
    const normalStyle = "text-lg font-medium text-gray-700 hover:text-black transition";

    useEffect(() => {
        async function handleVan() {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from("vans")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Host van fetch error:", error);
                setError("Van ma'lumotlarini o'qishda xatolik yuz berdi");
                setHostVan(null);
            } else {
                setHostVan(data);
            }

            setLoading(false);
        }

        if (id) {
            handleVan();
        }
    }, [id]);

    if (loading) {
        return (
            <section className="p-5">
                <div className="animate-pulse flex flex-col gap-5">
                    <div className="bg-gray-300 h-64 rounded-xl w-full"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
            </section>
        );
    }

    if (error || !hostVan) {
        return (
            <section className="p-10 flex flex-col items-start gap-5 bg-[rgba(255,247,237,1)]">
                <Link to="/host/hostVans" className="underline text-gray-700 hover:text-black">
                    &larr; Back to all vans
                </Link>
                <h2 className="text-2xl font-bold text-red-600">
                    {error || "Ushbu van topilmadi."}
                </h2>
            </section>
        );
    }

    const vanType = hostVan.type?.toLowerCase();
    let typeLabel = "Simple";
    let color = "rgba(225, 118, 84, 1)";

    if (vanType === "luxury" || vanType === "luxary") {
        typeLabel = "Luxury";
        color = "rgba(22, 22, 22, 1)";
    } else if (vanType === "rugged") {
        typeLabel = "Rugged";
        color = "rgba(17, 94, 89, 1)";
    }

    return (
        <section className="w-full p-5 flex flex-col gap-6 bg-[rgba(255,247,237,1)] min-h-screen">
            <Link to="/host/hostVans" className="underline text-gray-700 hover:text-black transition">
                <span className="text-xl font-bold mr-1">&larr;</span>Back to all vans
            </Link>

            <div className="bg-white rounded-xl p-6 flex flex-col gap-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <img
                        src={hostVan.img_url}
                        alt={hostVan.name}
                        className="w-36 h-36 object-cover rounded-lg"
                    />
                    <div className="flex flex-col items-start gap-2">
                        <span
                            style={{ backgroundColor: color }}
                            className="py-1 px-4 rounded text-xs font-semibold text-white capitalize"
                        >
                            {typeLabel}
                        </span>
                        <h1 className="text-3xl font-bold text-gray-900">{hostVan.name}</h1>
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-bold text-gray-900">${hostVan.price}</span>
                            <span className="text-sm text-gray-600">/day</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <nav className="flex items-center gap-6 border-b border-gray-100 pb-3">
                        <NavLink
                            to="."
                            end
                            className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
                        >
                            Details
                        </NavLink>
                        <NavLink
                            to="hostVanPrice"
                            className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
                        >
                            Price
                        </NavLink>
                        <NavLink
                            to="hostVanPhotos"
                            className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
                        >
                            Photos
                        </NavLink>
                    </nav>

                    {/* Pass hostVan and setHostVan via Outlet context */}
                    <Outlet context={{ hostVan, setHostVan }} />
                </div>
            </div>
        </section>
    );
}