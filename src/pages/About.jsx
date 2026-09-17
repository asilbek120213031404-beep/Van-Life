import { Link } from "react-router-dom";

export default function About() {
    return (
        <div className="flex flex-col gap-8 py-6 px-4 sm:px-8">
            <div className="rounded-xl overflow-hidden shadow-md max-h-80">
                <img
                    src="https://images.unsplash.com/photo-1527786356703-4b100091cd2c?q=80&w=1200&auto=format&fit=crop"
                    alt="Van camping under stars"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex flex-col gap-6 text-gray-800">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                    Don’t squeeze in a sedan when you could relax in a van.
                </h1>
                <p className="leading-relaxed text-gray-700">
                    Our mission is to enliven your road trip with the perfect travel van rental. Our vans are recertified before each trip to ensure your travel plans can go off without a hitch.
                </p>
                <p className="leading-relaxed text-gray-700">
                    Our team is full of vanlife enthusiasts who know firsthand the magic of touring the world on 4 wheels.
                </p>
            </div>

            <div className="bg-[rgba(255,204,143,1)] p-8 rounded-xl flex flex-col gap-6 my-4 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900">
                    Your destination is waiting.<br />Your van is ready.
                </h2>
                <Link
                    to="/vans"
                    className="bg-gray-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-black transition self-start shadow-md"
                >
                    Explore our vans
                </Link>
            </div>
        </div>
    );
}