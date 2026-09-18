import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import AddVanModal from "./AddVanModal";

export default function HostVans() {
    const [vans, setVans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    useEffect(() => {
        async function fetchHostVans() {
            setLoading(true);
            const { data, error } = await supabase
                .from("vans")
                .select("*")
                .order("id", { ascending: false });

            if (error) {
                console.error(error);
                setError("Ma'lumot olishda xatolik bor");
            } else {
                setVans(data ?? []);
            }
            setLoading(false);
        }

        fetchHostVans();
    }, []);

    return (
        <div className="flex flex-col items-start gap-6 w-full p-8 bg-[rgba(255,247,237,1)] min-h-screen">
            <div className="flex items-center justify-between w-full flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Your listed vans ({vans.length})</h1>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="px-4 py-2.5 bg-[rgba(255,140,56,1)] text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition shadow-md cursor-pointer flex items-center gap-2"
                >
                    <span>➕</span> Add Van / Villa
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500">Yuklanmoqda...</p>
            ) : error ? (
                <p className="text-red-500 font-medium">{error}</p>
            ) : vans.length === 0 ? (
                <p className="text-gray-600">Sizda hali hech qanday van yo'q.</p>
            ) : (
                <div className="w-full flex flex-col gap-4">
                    {vans.map((van) => (
                        <Link
                            key={van.id}
                            to={`/hostVan/${van.id}`}
                            className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={van.img_url}
                                    alt={van.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                                <div className="flex flex-col items-start gap-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold text-gray-900">{van.name}</h2>
                                        {van.type === "villa" && (
                                            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full uppercase">
                                                Villa
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 font-medium">${van.price}/day</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {isAddOpen && (
                <AddVanModal
                    onClose={() => setIsAddOpen(false)}
                    onAdded={(newVan) => {
                        setVans((prev) => [newVan, ...prev]);
                    }}
                />
            )}
        </div>
    );
}