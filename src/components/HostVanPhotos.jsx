import { useOutletContext } from "react-router-dom";

export default function HostVanPhotos() {
    const { hostVan } = useOutletContext();

    if (!hostVan) {
        return <p className="text-gray-500">Ma'lumotlar yuklanmoqda...</p>;
    }

    return (
        <div className="py-2">
            <img
                src={hostVan.img_url}
                alt={hostVan.name}
                className="w-36 h-36 object-cover rounded-lg shadow-sm border border-gray-100"
            />
        </div>
    );
}