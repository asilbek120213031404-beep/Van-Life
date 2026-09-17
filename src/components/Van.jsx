import { useEffect, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import BookingModal from "./BookingModal";
import VanReviews from "./VanReviews";

export default function Van() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [van, setVan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    const search = location.state?.search || "";
    const typeFilter = location.state?.type || "all";

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
                console.error("Van topishda xatolik:", error);
                setError("Van ma'lumotlarini yuklashda xatolik yuz berdi");
                setVan(null);
            } else {
                setVan(data);
            }

            setLoading(false);
        }

        if (id) {
            handleVan();
        }
    }, [id]);

    const handleRentClick = () => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: location } });
            return;
        }
        setIsBookingOpen(true);
    };

    if (loading) {
        return (
            <section className="p-5">
                <div className="animate-pulse flex flex-col gap-5">
                    <div className="bg-gray-300 h-[350px] sm:h-[450px] rounded-xl w-full"></div>
                    <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
            </section>
        );
    }

    if (error || !van) {
        return (
            <section className="p-10 flex flex-col items-start gap-5">
                <Link to={`/vans${search}`} className="underline text-gray-700 hover:text-black">
                    &larr; Back to {typeFilter} vans
                </Link>
                <h2 className="text-2xl font-bold text-red-600">
                    {error || "Kechirasiz, ushbu Van topilmadi."}
                </h2>
            </section>
        );
    }

    const vanType = van.type?.toLowerCase();
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
        <section className="w-full p-5 flex flex-col gap-8">
            <Link to={`/vans${search}`} className="underline text-gray-700 hover:text-black transition">
                <span className="text-xl font-bold mr-1">&larr;</span>
                Back to {typeFilter === "all" || !typeFilter ? "all" : typeFilter} vans
            </Link>

            <div className="flex flex-col gap-6">
                <img
                    src={van.img_url}
                    alt={van.name}
                    className="w-full rounded-xl object-cover max-h-[500px]"
                />

                <div className="flex flex-col items-start gap-4">
                    <span
                        style={{ backgroundColor: color }}
                        className="py-1 px-4 rounded-md text-sm font-semibold text-white capitalize"
                    >
                        {typeLabel}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900">{van.name}</h1>
                    <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold text-gray-900">${van.price}</span>
                        <span className="text-sm text-gray-600">/day</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{van.description}</p>

                    {/* Per-Van Reviews section placed RIGHT ABOVE Rent button */}
                    <VanReviews vanId={van.id} vanName={van.name} />

                    <button
                        onClick={handleRentClick}
                        className="w-full mt-2 p-3.5 bg-[rgba(255,140,56,1)] text-lg font-bold text-white rounded-xl hover:bg-orange-600 transition cursor-pointer shadow-md"
                    >
                        Rent this van
                    </button>
                </div>
            </div>

            {/* Booking Modal */}
            {isBookingOpen && (
                <BookingModal
                    van={van}
                    user={user}
                    onClose={() => setIsBookingOpen(false)}
                />
            )}
        </section>
    );
}