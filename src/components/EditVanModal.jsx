import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function EditVanModal({ van, onClose, onUpdated }) {
    const [name, setName] = useState(van.name || "");
    const [price, setPrice] = useState(van.price || "");
    const [description, setDescription] = useState(van.description || "");
    const [type, setType] = useState(van.type || "simple");
    const [imgUrl, setImgUrl] = useState(van.img_url || "");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            setSubmitting(true);
            const { data, error: updateError } = await supabase
                .from("vans")
                .update({
                    name,
                    price: Number(price),
                    description,
                    type,
                    img_url: imgUrl,
                })
                .eq("id", van.id)
                .select()
                .single();

            if (updateError) throw updateError;

            if (onUpdated) {
                onUpdated(data);
            }
            onClose();
        } catch (err) {
            console.error("Update error:", err);
            setError(err.message || "Van ma'lumotlarini o'zgartirishda xatolik yuz berdi");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold text-gray-900">Edit Van Details</h2>

                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Van Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2.5 rounded-xl w-full bg-gray-50 focus:bg-white border-gray-300"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Price per day ($)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="border p-2.5 rounded-xl w-full bg-gray-50 focus:bg-white border-gray-300"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Category Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="border p-2.5 rounded-xl w-full bg-gray-50 focus:bg-white border-gray-300 font-medium"
                        >
                            <option value="simple">Simple</option>
                            <option value="luxury">Luxury</option>
                            <option value="rugged">Rugged</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Image URL</label>
                        <input
                            type="url"
                            value={imgUrl}
                            onChange={(e) => setImgUrl(e.target.value)}
                            className="border p-2.5 rounded-xl w-full bg-gray-50 focus:bg-white border-gray-300"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Description</label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border p-2.5 rounded-xl w-full bg-gray-50 focus:bg-white border-gray-300"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-2 py-3 bg-[rgba(255,140,56,1)] text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-md disabled:opacity-50"
                    >
                        {submitting ? "Saqlanmoqda..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
