import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function AddVanModal({ onClose, onAdded }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("simple");
    const [imgUrl, setImgUrl] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!name || !price || !imgUrl || !description) {
            setError("Iltimos, barcha maydonlarni to'ldiring!");
            return;
        }

        try {
            setSubmitting(true);
            const { data, error: insertError } = await supabase
                .from("vans")
                .insert([
                    {
                        name,
                        price: Number(price),
                        type,
                        img_url: imgUrl,
                        description,
                    },
                ])
                .select()
                .single();

            if (insertError) throw insertError;

            if (onAdded) {
                onAdded(data);
            }
            onClose();
        } catch (err) {
            console.error("Add van error:", err);
            setError(err.message || "Yangi van/villa qo'shishda xatolik yuz berdi. SQL ruxsatini tekshiring.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition cursor-pointer"
                >
                    &times;
                </button>

                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold text-gray-900">➕ Yangi Van yoki Villa Qo'shish</h2>
                    <p className="text-xs text-gray-500">Supabase katalogiga yangi e'lon qo'shish formulasi</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Van / Villa Nomi</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Masalan: Modest Explorer yoki Grand Villa"
                            className="border p-2.5 rounded-xl w-full bg-gray-50 focus:bg-white border-gray-300 outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Kunlik Narxi ($)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Masalan: 80"
                            className="border p-2.5 rounded-xl w-full bg-gray-50 focus:bg-white border-gray-300 outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Kategoriya Turi</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="border p-2.5 rounded-xl w-full bg-gray-50 focus:bg-white border-gray-300 font-medium outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="simple">Simple</option>
                            <option value="luxury">Luxury</option>
                            <option value="rugged">Rugged</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Rasm Havolasi (Image URL)</label>
                        <input
                            type="url"
                            value={imgUrl}
                            onChange={(e) => setImgUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="border p-2.5 rounded-xl w-full bg-gray-50 focus:bg-white border-gray-300 outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Tavsifi (Description)</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Avtomobil yoki villa haqida batafsil ma'lumot..."
                            className="border p-2.5 rounded-xl w-full bg-gray-50 focus:bg-white border-gray-300 outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-2 py-3.5 bg-[rgba(255,140,56,1)] text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-md disabled:opacity-50 cursor-pointer"
                    >
                        {submitting ? "Saqlanmoqda..." : "Katalogga Qo'shish"}
                    </button>
                </form>
            </div>
        </div>
    );
}
