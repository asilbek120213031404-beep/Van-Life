import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import AddReviewModal from "./AddReviewModal";

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    useEffect(() => {
        async function fetchReviews() {
            setLoading(true);
            setError("");

            const { data, error } = await supabase
                .from("reviews")
                .select("*, vans(name)")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Reviews fetch error:", error);
                setError("Sharhlarni o'qishda xatolik yuz berdi");
                setReviews([]);
            } else {
                setReviews(data ?? []);
            }
            setLoading(false);
        }

        fetchReviews();
    }, []);

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "5.0";

    return (
        <section className="p-8 flex flex-col gap-6 bg-[rgba(255,247,237,1)] min-h-screen">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-baseline gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Your reviews</h1>
                    <p className="text-sm text-gray-500">Real Supabase Reviews</p>
                </div>

                <button
                    onClick={() => setIsAddOpen(true)}
                    className="px-4 py-2 bg-[rgba(255,140,56,1)] text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition shadow-sm cursor-pointer"
                >
                    + Sharh Qoldirish
                </button>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-900">{avgRating}</span>
                <span className="text-yellow-500 text-2xl">★</span>
                <span className="text-gray-600 text-sm font-medium">overall rating</span>
            </div>

            <div className="flex flex-col gap-6 mt-4">
                <h3 className="text-xl font-bold text-gray-900">Reviews ({reviews.length})</h3>

                {loading ? (
                    <div className="flex flex-col gap-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-28 bg-gray-200 animate-pulse rounded-xl"></div>
                        ))}
                    </div>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : reviews.length === 0 ? (
                    <div className="bg-white p-6 rounded-xl text-center text-gray-500 font-medium">
                        Hali hech qanday sharhlar qoldirilmagan. Birinchi bo'lib siz sharh qoldiring!
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white p-6 rounded-xl flex flex-col gap-3 shadow-xs border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <span key={i} className="text-lg">★</span>
                                        ))}
                                    </div>
                                    {review.vans?.name && (
                                        <span className="text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-semibold">
                                            {review.vans.name}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900">{review.user_name || "Foydalanuvchi"}</span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-700 leading-relaxed text-sm">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isAddOpen && (
                <AddReviewModal
                    onClose={() => setIsAddOpen(false)}
                    onReviewAdded={(newReview) => {
                        setReviews((prev) => [newReview, ...prev]);
                    }}
                />
            )}
        </section>
    );
}