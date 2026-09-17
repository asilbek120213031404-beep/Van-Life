import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function MyVan() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeBookings, setActiveBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [returningId, setReturningId] = useState(null);
    const [message, setMessage] = useState("");

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        async function fetchActiveBookings() {
            if (!user) return;
            setLoading(true);

            const { data, error } = await supabase
                .from("bookings")
                .select("*, vans(*)")
                .eq("user_id", user.id)
                .eq("status", "confirmed")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("MyVan fetch error:", error);
                setActiveBookings([]);
            } else {
                setActiveBookings(data ?? []);
            }

            setLoading(false);
        }

        fetchActiveBookings();
    }, [user]);

    async function handleReturnVan(bookingId, vanName) {
        try {
            setReturningId(bookingId);
            const { error } = await supabase
                .from("bookings")
                .update({ status: "completed" })
                .eq("id", bookingId);

            if (error) throw error;

            setMessage(`"${vanName}" muvaffaqiyatli topshirildi va ijara yopildi!`);
            
            // Remove returned booking from local state
            setActiveBookings((prev) => prev.filter((b) => b.id !== bookingId));

            // Notify Header component to update counter
            window.dispatchEvent(new Event("booking-updated"));
        } catch (err) {
            console.error("Return van error:", err);
            alert("Vanni qaytarishda xatolik yuz berdi");
        } finally {
            setReturningId(null);
        }
    }

    if (loading) {
        return (
            <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-10 max-w-4xl mx-auto flex flex-col gap-8 min-h-[500px]">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-3xl font-extrabold text-gray-900">
                    Sizning Ijaradagi Avtomobillaringiz ({activeBookings.length})
                </h1>
                <Link to="/vans" className="text-sm font-bold text-orange-600 hover:underline">
                    + Yevro van ijara olish
                </Link>
            </div>

            {message && (
                <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-xl text-center font-medium shadow-xs">
                    {message}
                </div>
            )}

            {activeBookings.length > 0 ? (
                <div className="flex flex-col gap-6">
                    {activeBookings.map((booking) => {
                        const van = booking.vans;
                        if (!van) return null;

                        const isOverdue = booking.end_date < today;

                        return (
                            <div
                                key={booking.id}
                                className={`rounded-2xl p-6 sm:p-8 border shadow-md flex flex-col gap-6 transition ${
                                    isOverdue
                                        ? "bg-red-50/50 border-red-300 ring-2 ring-red-400"
                                        : "bg-white border-orange-200"
                                }`}
                            >
                                {/* Overdue Warning Banner */}
                                {isOverdue && (
                                    <div className="bg-red-600 text-white px-4 py-3 rounded-xl flex items-center gap-3 font-bold text-sm shadow-sm animate-pulse">
                                        <span className="text-xl">⚠️</span>
                                        <div>
                                            OGOHLANTIRISH: IJARA MUDDATI O'TIB KETGAN! ({booking.end_date})
                                            <p className="text-xs font-normal opacity-90">
                                                Iltimos, ushbu avtomobilni zudlik bilan topshiring yoki aloqaga chiqing.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                    <img
                                        src={van.img_url}
                                        alt={van.name}
                                        className="w-full sm:w-48 h-48 object-cover rounded-xl shadow-sm"
                                    />
                                    <div className="flex flex-col items-start gap-3">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${
                                                    isOverdue
                                                        ? "bg-red-200 text-red-900"
                                                        : "bg-green-100 text-green-800"
                                                }`}
                                            >
                                                {isOverdue ? "● Muddati O'tgan" : "● Faol Ijara"}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900">{van.name}</h2>
                                        <p className="text-xl font-bold text-orange-600">${van.price}/day</p>
                                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                            {van.description}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className={`p-5 rounded-xl border grid grid-cols-1 sm:grid-cols-3 gap-4 text-center ${
                                        isOverdue ? "bg-red-100/60 border-red-200" : "bg-orange-50 border-orange-100"
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 font-medium">Boshlanishi:</span>
                                        <span className="text-base font-bold text-gray-900">{booking.start_date}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 font-medium">Tugashi:</span>
                                        <span
                                            className={`text-base font-bold ${
                                                isOverdue ? "text-red-700 underline" : "text-gray-900"
                                            }`}
                                        >
                                            {booking.end_date}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 font-medium">Jami Summa:</span>
                                        <span className="text-base font-bold text-orange-600">${booking.total_price}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleReturnVan(booking.id, van.name)}
                                    disabled={returningId === booking.id}
                                    className={`w-full py-4 text-white font-bold text-lg rounded-xl transition shadow-md cursor-pointer disabled:opacity-50 ${
                                        isOverdue ? "bg-red-700 hover:bg-red-800" : "bg-red-600 hover:bg-red-700"
                                    }`}
                                >
                                    {returningId === booking.id
                                        ? "Qaytarilmoqda..."
                                        : `🚗 "${van.name}" ni Topshirish / Qaytarib Berish`}
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-[rgba(255,247,237,1)] p-10 rounded-2xl flex flex-col items-center justify-center text-center gap-6 border border-orange-100">
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-3xl font-bold">
                        🚐
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold text-gray-900">Hozirda sizda aktiv ijara mavjud emas</h2>
                        <p className="text-gray-600 text-sm max-w-md">
                            Siz ijaraga olgan vanlar topshirilgan yoki hali yangi van band qilmadingiz. Sayohat qilish uchun eng yaxshi vanlarni tanlang!
                        </p>
                    </div>
                    <Link
                        to="/vans"
                        className="px-6 py-3 bg-[rgba(255,140,56,1)] text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-md"
                    >
                        Vanlarni Ko'rish
                    </Link>
                </div>
            )}
        </div>
    );
}
