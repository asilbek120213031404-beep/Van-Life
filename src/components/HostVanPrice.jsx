import { useOutletContext } from "react-router-dom";

export default function HostVanPrice() {
    const { hostVan } = useOutletContext();

    if (!hostVan) {
        return <p className="text-gray-500">Ma'lumotlar yuklanmoqda...</p>;
    }

    return (
        <h1 className="text-3xl font-bold flex items-center gap-1 text-gray-900 py-2">
            ${hostVan.price}.00 <span className="text-lg font-medium text-gray-500">/day</span>
        </h1>
    );
}