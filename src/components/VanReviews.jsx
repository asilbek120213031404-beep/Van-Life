import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function VanReviews({ vanId, vanName }) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Modal state
    const [guestName, setGuestName] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchVanReviews() {
            if (!vanId) return;
            setLoading(true);

            const { data, error } = await supabase
                .from("reviews")
                .select("*")
                .eq("van_id", vanId)
                .order("created_at", { ascending: false });

            if (!error && data) {
                setReviews(data);
            } else {
                setReviews([]);
            }
            setLoading(false);
        }

        fetchVanReviews();
    }, [vanId]);

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "5.0";

    async function handleReviewSubmit(e) {
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
                        van_id: vanId,
                        user_id: user ? user.id : null,
                        user_name: authorName,
                        rating: Number(rating),
                        comment: comment.trim(),
                    },
                ])
                .select()
                .single();

            if (insertError) throw insertError;

            setReviews((prev) => [data, ...prev]);
            setComment("");
            setIsModalOpen(false);
        } catch (err) {
            console.error("Review error:", err);
            setError(err.message || "Sharh saqlashda xatolik yuz berdi");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="w-full my-4 flex flex-col gap-5 bg-orange-50/50 p-6 rounded-2xl border border-orange-100 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-orange-200 pb-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">Ushbu Van Sharhlari ({reviews.length})</h3>
                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                        <span>★</span>
                        <span>{avgRating}</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-[rgba(255,140,56,1)] text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition shadow-sm cursor-pointer"
                >
                    + Sharh Qoldirish
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col gap-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-xl"></div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm font-medium bg-white rounded-xl border border-gray-100 p-4">
                    Ushbu van uchun hali sharhlar mavjud emas. Birinchi bo'lib siz sharh qoldiring!
                </div>
            ) : (
                <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1">
                    {reviews.map((rev) => (
                        <div key={rev.id} className="bg-white p-4 rounded-xl flex flex-col gap-2 shadow-xs border border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-900 text-sm">{rev.user_name || "Foydalanuvchi"}</span>
                                <div className="flex items-center gap-0.5 text-yellow-500 text-sm">
                                    {[...Array(rev.rating)].map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">{rev.comment}</p>
                            <span className="text-[10px] text-gray-400 self-end">
                                {new Date(rev.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for adding review for this van */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-5 relative animate-fadeIn">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition cursor-pointer"
                        >
                            &times;
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900">{vanName} uchun Sharh Qoldirish</h2>

                        {error && (
                            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
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
                                    placeholder="Ushbu avtomobil haqida fikringiz..."
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
            )}
        </div>
    );
}
