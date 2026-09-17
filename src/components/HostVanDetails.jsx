import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import EditVanModal from "./EditVanModal";

export default function HostVanDetails() {
    const { hostVan, setHostVan } = useOutletContext();
    const [isEditing, setIsEditing] = useState(false);

    if (!hostVan) {
        return <p className="text-gray-500">Ma'lumotlar yuklanmoqda...</p>;
    }

    const vanType = hostVan.type?.toLowerCase();
    const typeLabel = (vanType === "luxury" || vanType === "luxary") ? "Luxury" : vanType === "rugged" ? "Rugged" : "Simple";

    return (
        <div className="flex flex-col gap-4 text-gray-800 py-2">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Van Details</h3>
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-1.5 bg-gray-900 text-white font-semibold text-xs rounded-lg hover:bg-black transition cursor-pointer shadow-xs"
                >
                    ✏️ Edit Van
                </button>
            </div>

            <div className="flex items-start gap-2">
                <span className="font-bold">Name:</span>
                <span>{hostVan.name}</span>
            </div>
            <div className="flex items-start gap-2">
                <span className="font-bold">Category:</span>
                <span className="capitalize">{typeLabel}</span>
            </div>
            <div className="flex items-start gap-2">
                <span className="font-bold">Price:</span>
                <span>${hostVan.price}/day</span>
            </div>
            <div className="flex items-start gap-2">
                <span className="font-bold">Description:</span>
                <span className="leading-relaxed max-w-2xl">{hostVan.description}</span>
            </div>
            <div className="flex items-start gap-2">
                <span className="font-bold">Visibility:</span>
                <span>Public</span>
            </div>

            {isEditing && (
                <EditVanModal
                    van={hostVan}
                    onClose={() => setIsEditing(false)}
                    onUpdated={(updatedVan) => {
                        if (setHostVan) setHostVan(updatedVan);
                    }}
                />
            )}
        </div>
    );
}