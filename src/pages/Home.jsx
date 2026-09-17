import { Link } from "react-router-dom";

export default function Home() {
    return (
        <section className="home flex flex-col items-start gap-10 px-8 py-16 bg-cover bg-center text-white rounded-lg my-4 min-h-[450px] justify-between">
            <div className="flex flex-col items-start gap-6 max-w-lg">
                <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
                    You got the travel plans, we got the travel vans.
                </h1>
                <p className="text-gray-100 leading-relaxed text-sm sm:text-base">
                    Add adventure to your life by joining the #vanlife movement. Rent the perfect van to make your perfect road trip.
                </p>
            </div>
            <Link
                to="/vans"
                className="bg-[rgba(255,140,56,1)] text-white py-3 px-6 w-full text-center rounded-md font-bold text-lg hover:bg-orange-600 transition shadow-lg"
            >
                Find your van
            </Link>
        </section>
    );
}