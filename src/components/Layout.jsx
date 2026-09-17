import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen max-w-5xl w-full mx-auto bg-white shadow-sm border-x border-orange-50 overflow-x-hidden">
            <Header />
            <main className="flex-1 w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}