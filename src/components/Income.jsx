import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function Income() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchIncomeData() {
        setLoading(true);
        setError("");

        const { data, error } = await supabase
            .from("bookings")
            .select("*, vans(name)")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Income fetch error:", error);
            setError("Tranzaksiyalar ma'lumotini o'qishda xatolik");
            setBookings([]);
        } else {
            setBookings(data ?? []);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchIncomeData();

        // Listen for booking updates across windows/tabs
        window.addEventListener("booking-updated", fetchIncomeData);
        return () => window.removeEventListener("booking-updated", fetchIncomeData);
    }, []);

    const totalIncome = bookings.reduce((acc, b) => acc + (Number(b.total_price) || 0), 0);

    return (
        <section className="p-8 flex flex-col gap-6 bg-[rgba(255,247,237,1)] min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900">Income</h1>
            <p className="text-gray-600">
                Last <span className="font-semibold text-black underline">30 days</span>
            </p>

            {loading ? (
                <div className="h-12 w-48 bg-gray-300 animate-pulse rounded-lg"></div>
            ) : (
                <div className="flex flex-col gap-1">
                    <h2 className="text-4xl font-extrabold text-gray-900">${totalIncome.toLocaleString()}.00</h2>
                </div>
            )}

            <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Your transactions ({bookings.length})</h3>
                    <p className="text-sm text-gray-500">Real Supabase Transactions</p>
                </div>

                {loading ? (
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-xl"></div>
                        ))}
                    </div>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : bookings.length === 0 ? (
                    <div className="bg-white p-6 rounded-xl text-center text-gray-500 font-medium">
                        Hozircha hech qanday ijara tranzaksiyalari yo'q.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {bookings.map((item) => (
                            <div key={item.id} className="bg-white p-5 rounded-xl flex items-center justify-between shadow-xs">
                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-bold text-gray-900">+${item.total_price}</h3>
                                    <p className="text-xs text-gray-500">
                                        Van: <strong>{item.vans?.name || "Van"}</strong> ({item.start_date} &rarr; {item.end_date})
                                    </p>
                                </div>
                                <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full capitalize">
                                    {item.status || "confirmed"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}