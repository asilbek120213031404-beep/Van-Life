import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex flex-col items-start justify-center gap-8 w-full p-10 min-h-[400px]">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                Sorry, the page you were looking for was not found.
            </h1>
            <Link
                to="/"
                className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white font-bold text-center rounded-md hover:bg-black transition shadow-md"
            >
                Return to home
            </Link>
        </div>
    );
}