import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function BookingModal({ van, user, onClose }) {
    const today = new Date().toISOString().split("T")[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 2);
    const defaultEnd = tomorrowDate.toISOString().split("T")[0];

    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(defaultEnd);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successBooking, setSuccessBooking] = useState(null);

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isValidDates = days > 0;
    const totalPrice = isValidDates ? days * van.price : 0;

    async function handleBookingSubmit(e) {
        e.preventDefault();
        setError("");

        if (!isValidDates) {
            setError("Tugash sanasi boshlanish sanasidan keyin bo'lishi kerak!");
            return;
        }

        try {
            setSubmitting(true);
            const { data, error: bookingError } = await supabase
                .from("bookings")
                .insert([
                    {
                        van_id: van.id,
                        user_id: user.id,
                        start_date: startDate,
                        end_date: endDate,
                        total_price: totalPrice,
                        status: "confirmed",
                    },
                ])
                .select()
                .single();

            if (bookingError) throw bookingError;

            setSuccessBooking(data);

            // Notify Header component that booking state changed
            window.dispatchEvent(new Event("booking-updated"));
        } catch (err) {
            console.error("Booking submit error:", err);
            setError(err.message || "Buyurtma saqlashda xatolik yuz berdi. SQL jadvali yaratilganini tekshiring.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-6 relative animate-fadeIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition cursor-pointer"
                >
                    &times;
                </button>

                {successBooking ? (
                    <div className="flex flex-col items-center text-center gap-4 py-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl font-bold">
                            ✓
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Buyurtma Muvaffaqiyatli Saqlandi!</h2>
                        <p className="text-gray-600 text-sm">
                            Siz <strong>{van.name}</strong> avtomobilini <strong>{days} kun</strong> muddatga ijara oldingiz.
                        </p>
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 w-full flex flex-col gap-2 text-left text-sm text-gray-800">
                            <div><strong>Boshlanishi:</strong> {startDate}</div>
                            <div><strong>Tugashi:</strong> {endDate}</div>
                            <div className="text-base font-bold text-orange-600">
                                Jami To'lov: ${totalPrice}.00
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full mt-2 py-3 bg-[rgba(255,140,56,1)] text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-md cursor-pointer"
                        >
                            Tushundim
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-2xl font-bold text-gray-900">Rent {van.name}</h2>
                            <p className="text-sm text-gray-500">${van.price}/day</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Boshlanish Sanasi
                                </label>
                                <input
                                    type="date"
                                    min={today}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border border-gray-300 p-3 rounded-xl w-full text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Tugash Sanasi
                                </label>
                                <input
                                    type="date"
                                    min={startDate}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border border-gray-300 p-3 rounded-xl w-full text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition"
                                    required
                                />
                            </div>

                            <div className="bg-gray-100 p-4 rounded-xl flex items-center justify-between my-2">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 font-medium">Jami Kunlar:</span>
                                    <span className="text-lg font-bold text-gray-900">
                                        {isValidDates ? `${days} kun` : "Xato sana"}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-gray-500 font-medium">Jami Summa:</span>
                                    <span className="text-2xl font-extrabold text-[rgba(255,140,56,1)]">
                                        ${totalPrice}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || !isValidDates}
                                className="w-full p-3.5 bg-[rgba(255,140,56,1)] text-white font-bold text-lg rounded-xl hover:bg-orange-600 transition cursor-pointer disabled:opacity-50 shadow-lg"
                            >
                                {submitting ? "Buyurtma rasmiylashtirilmoqda..." : "Tasdiqlash & Ijara Olish"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
