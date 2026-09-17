import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function AddReviewModal({ onClose, onReviewAdded }) {
    const { user } = useAuth();
    const [vans, setVans] = useState([]);
    const [selectedVanId, setSelectedVanId] = useState("");
    const [guestName, setGuestName] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchVans() {
            const { data } = await supabase.from("vans").select("id, name");
            if (data && data.length > 0) {
                setVans(data);
                setSelectedVanId(data[0].id);
            }
        }
        fetchVans();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const authorName = user
            ? (user.user_metadata?.display_name || user.email?.split("@")[0] || "Foydalanuvchi")
            : (guestName.trim() || "Mehmon");

        if (!user && !guestName.trim()) {
            setError("Iltimos, ismingizni kiriting!");
            return;
        }

        if (!comment.trim()) {
            setError("Iltimos, sharh matnini kiriting!");
            return;
        }

        try {
            setSubmitting(true);
            const { data, error: insertError } = await supabase
                .from("reviews")
                .insert([
                    {
                        van_id: selectedVanId || null,
                        user_id: user ? user.id : null,
                        user_name: authorName,
                        rating: Number(rating),
                        comment: comment.trim(),
                    },
                ])
                .select()
                .single();

            if (insertError) throw insertError;

            if (onReviewAdded) onReviewAdded(data);
            onClose();
        } catch (err) {
            console.error("Review submit error:", err);
            setError(err.message || "Sharh yuborishda xatolik yuz berdi.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-5 relative animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition cursor-pointer"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold text-gray-900">Sharh va Reyting Qoldirish</h2>

                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {!user && (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-700 uppercase">Ismingiz</label>
                            <input
                                type="text"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="Ismingizni kiriting"
                                className="border p-2.5 rounded-xl w-full bg-gray-50 focus:bg-white border-gray-300"
                                required
                            />
                        </div>
                    )}

                    {vans.length > 0 && (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-700 uppercase">Van Tanlang</label>
                            <select
                                value={selectedVanId}
                                onChange={(e) => setSelectedVanId(e.target.value)}
                                className="border p-2.5 rounded-xl w-full bg-gray-50 focus:bg-white border-gray-300 font-medium"
                            >
                                {vans.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Reyting (1 - 5 yulduz)</label>
                        <div className="flex items-center gap-2 py-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-3xl transition cursor-pointer ${
                                        star <= rating ? "text-yellow-500 scale-110" : "text-gray-300"
                                    }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Izohingiz</label>
                        <textarea
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tajribangiz haqida yozing..."
                            className="border p-3 rounded-xl w-full bg-gray-50 focus:bg-white border-gray-300"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-2 py-3 bg-[rgba(255,140,56,1)] text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-md disabled:opacity-50 cursor-pointer"
                    >
                        {submitting ? "Yuborilmoqda..." : "Sharhni Chop Etish"}
                    </button>
                </form>
            </div>
        </div>
    );
}
