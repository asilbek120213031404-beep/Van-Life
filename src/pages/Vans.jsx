import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";
import { Link, useSearchParams } from "react-router-dom";

export default function Vans() {
    const [allVans, setAllVans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const INITIAL_LIMIT = 4;
    const [limit, setLimit] = useState(INITIAL_LIMIT);

    const [searchParams, setSearchParams] = useSearchParams();
    const typeFilter = searchParams.get("type");

    const handleFilterChange = (key, value) => {
        setSearchParams((prevParams) => {
            if (value === null) {
                prevParams.delete(key);
            } else {
                prevParams.set(key, value);
            }
            return prevParams;
        });
    };

    useEffect(() => {
        async function fetchVans() {
            setLoading(true);
            setError("");

            const { data, error } = await supabase
                .from("vans")
                .select("*");

            if (error) {
                console.error(error);
                setError("Ma'lumot olishda xatolik yuz berdi");
                setAllVans([]);
            } else {
                setAllVans(data ?? []);
            }

            setLoading(false);
        }

        fetchVans();
    }, []);

    // Reset visible limit whenever filter changes
    useEffect(() => {
        setLimit(INITIAL_LIMIT);
    }, [typeFilter]);

    const displayedVans = typeFilter
        ? allVans.filter((van) => {
            const vanType = van.type?.toLowerCase();
            const filterType = typeFilter.toLowerCase();
            if (filterType === "luxury") {
                return vanType === "luxury" || vanType === "luxary";
            }
            return vanType === filterType;
        })
        : allVans;

    const visibleVans = displayedVans.slice(0, limit);
    const hasMore = limit < displayedVans.length;
    const isExpanded = limit > INITIAL_LIMIT;

    const handleShowMore = () => {
        setLimit((prev) => prev + 8);
    };

    const handleShowLess = () => {
        setLimit(INITIAL_LIMIT);
    };

    if (loading) {
        return (
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="animate-pulse flex flex-col gap-3">
                        <div className="bg-gray-300 h-52 rounded-xl w-full"></div>
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-5 bg-gray-300 rounded w-1/2"></div>
                    </div>
                ))}
            </section>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-600 font-medium">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="px-5 py-8 flex flex-col gap-8">
            <section className="flex flex-col gap-5">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Explore our van options</h1>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <nav className="flex items-center gap-3">
                        <button
                            onClick={() => handleFilterChange("type", typeFilter === "simple" ? null : "simple")}
                            className={`px-4 py-2 rounded-md font-medium text-sm transition cursor-pointer ${typeFilter === "simple"
                                ? "bg-[rgba(225,118,84,1)] text-white"
                                : "bg-[rgba(255,234,208,1)] text-gray-800 hover:bg-[rgba(225,118,84,1)] hover:text-white"
                                }`}
                        >
                            Simple
                        </button>
                        <button
                            onClick={() => handleFilterChange("type", typeFilter === "luxury" ? null : "luxury")}
                            className={`px-4 py-2 rounded-md font-medium text-sm transition cursor-pointer ${typeFilter === "luxury"
                                ? "bg-[rgba(22,22,22,1)] text-white"
                                : "bg-[rgba(255,234,208,1)] text-gray-800 hover:bg-[rgba(22,22,22,1)] hover:text-white"
                                }`}
                        >
                            Luxury
                        </button>
                        <button
                            onClick={() => handleFilterChange("type", typeFilter === "rugged" ? null : "rugged")}
                            className={`px-4 py-2 rounded-md font-medium text-sm transition cursor-pointer ${typeFilter === "rugged"
                                ? "bg-[rgba(17,94,89,1)] text-white"
                                : "bg-[rgba(255,234,208,1)] text-gray-800 hover:bg-[rgba(17,94,89,1)] hover:text-white"
                                }`}
                        >
                            Rugged
                        </button>
                    </nav>

                    {typeFilter && (
                        <button
                            onClick={() => handleFilterChange("type", null)}
                            className="font-medium text-sm text-gray-600 underline hover:text-black transition cursor-pointer"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {visibleVans.map((van) => {
                    const rawType = van.type?.toLowerCase();
                    let typeLabel = "Simple";
                    let color = "rgba(225, 118, 84, 1)";

                    if (rawType === "luxury" || rawType === "luxary") {
                        typeLabel = "Luxury";
                        color = "rgba(22, 22, 22, 1)";
                    } else if (rawType === "rugged") {
                        typeLabel = "Rugged";
                        color = "rgba(17, 94, 89, 1)";
                    }

                    return (
                        <Link
                            key={van.id}
                            to={`/van/${van.id}`}
                            state={{ search: `?${searchParams.toString()}`, type: typeFilter }}
                            className="group flex flex-col gap-3"
                        >
                            <div className="overflow-hidden rounded-xl bg-gray-100 aspect-square">
                                <img
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    src={van.img_url}
                                    alt={van.name}
                                />
                            </div>
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col items-start gap-1">
                                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-[rgba(247,94,5,1)] transition">
                                        {van.name}
                                    </h2>
                                    <span
                                        style={{ backgroundColor: color }}
                                        className="py-1 px-4 rounded-md text-xs font-semibold text-white capitalize"
                                    >
                                        {typeLabel}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xl font-bold text-gray-900">${van.price}</span>
                                    <span className="text-xs text-gray-500">/day</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </section>

            {/* Show More & Show Less controls */}
            {displayedVans.length > INITIAL_LIMIT && (
                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                    {hasMore && (
                        <button
                            onClick={handleShowMore}
                            className="px-6 py-2.5 bg-[rgba(255,140,56,1)] text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-sm cursor-pointer text-sm"
                        >
                            Show More ({displayedVans.length - limit} left)
                        </button>
                    )}
                    {isExpanded && (
                        <button
                            onClick={handleShowLess}
                            className="px-6 py-2.5 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition cursor-pointer text-sm"
                        >
                            Show Less
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}