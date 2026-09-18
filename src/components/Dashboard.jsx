import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import AddVanModal from "./AddVanModal";

export default function Dashboard() {
    const [vans, setVans] = useState([]);
    const [income, setIncome] = useState(0);
    const [avgRating, setAvgRating] = useState("5.0");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);

    useEffect(() => {
        async function fetchDashboardData() {
            setLoading(true);
            try {
                // 1. Fetch Vans
                const { data: vansData } = await supabase
                    .from("vans")
                    .select("*")
                    .order("id", { ascending: false });
                setVans(vansData ?? []);

                // 2. Fetch Bookings for total income sum
                const { data: bookingsData } = await supabase.from("bookings").select("total_price");
                if (bookingsData) {
                    const total = bookingsData.reduce((acc, b) => acc + (Number(b.total_price) || 0), 0);
                    setIncome(total);
                }

                // 3. Fetch Reviews for avg rating calculation
                const { data: reviewsData } = await supabase.from("reviews").select("rating");
                if (reviewsData && reviewsData.length > 0) {
                    const avg = (reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length).toFixed(1);
                    setAvgRating(avg);
                }
            } catch (err) {
                console.error("Dashboard data error:", err);
                setError("Ma'lumotlarni o'qishda xatolik");
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    const viewAll = showAll ? vans : vans.slice(0, 3);

    return (
        <div className="flex flex-col w-full">
            {/* Income summary section */}
            <div className="flex flex-col items-start justify-between w-full p-8 gap-6 bg-[rgba(255,234,208,1)]">
                <div className="flex items-end justify-between w-full">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-bold text-gray-900">Welcome!</h1>
                        <p className="text-gray-600">
                            Income last{" "}
                            <span className="text-black underline font-semibold">30 days</span>
                        </p>
                    </div>
                    <Link to="income" className="font-medium text-gray-900 hover:underline">
                        Details
                    </Link>
                </div>
                {loading ? (
                    <div className="h-12 w-48 bg-orange-200 animate-pulse rounded-lg"></div>
                ) : (
                    <h1 className="text-5xl font-black text-gray-900">${income.toLocaleString()}.00</h1>
                )}
            </div>

            {/* Review score section */}
            <div className="flex items-center justify-between w-full p-8 bg-[rgba(255,221,178,1)]">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">Review score</h2>
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-600 text-xl">★</span>
                        <span className="text-xl font-bold">{avgRating}</span>
                        <span className="font-normal text-gray-600">/5</span>
                    </div>
                </div>
                <Link to="reviews" className="font-medium text-gray-900 hover:underline">
                    Details
                </Link>
            </div>

            {/* Listed vans section */}
            <div className="flex flex-col gap-6 w-full p-8 bg-[rgba(255,247,237,1)]">
                <div className="flex items-center justify-between w-full flex-wrap gap-4">
                    <h2 className="text-2xl font-bold text-gray-900">Your listed vans ({vans.length})</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-3.5 py-1.5 bg-[rgba(255,140,56,1)] text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                            <span>➕</span> Add Van / Villa
                        </button>
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="font-medium text-gray-800 underline hover:text-orange-600 cursor-pointer text-sm"
                        >
                            {showAll ? "Show less" : "View all"}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p className="text-gray-500">Yuklanmoqda...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="w-full flex flex-col gap-4">
                        {viewAll.map((van) => (
                            <Link
                                key={van.id}
                                to={`/hostVan/${van.id}`}
                                className="bg-white p-4 rounded-lg flex items-center justify-between hover:shadow-md transition"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={van.img_url}
                                        alt={van.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                    <div className="flex flex-col items-start gap-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-gray-900">{van.name}</h3>
                                            {van.type === "villa" && (
                                                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full uppercase">
                                                    Villa
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600">${van.price}/day</p>
                                    </div>
                                </div>
                                <span className="font-medium text-gray-700 hover:text-black">Edit</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

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