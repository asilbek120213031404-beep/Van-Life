import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ isAuthenticated: customIsAuth, requireAdmin = false, children }) {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20 min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgba(255,140,56,1)]"></div>
            </div>
        );
    }

    const isAuth = customIsAuth !== undefined ? customIsAuth : isAuthenticated;

    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Admin email check
    const ADMIN_EMAIL = "mrasilbek3@gmail.com";
    if (requireAdmin && user?.email !== ADMIN_EMAIL) {
        return (
            <div className="flex flex-col items-center justify-center p-10 min-h-[450px] text-center gap-6 bg-[rgba(255,247,237,1)] rounded-2xl my-10 border border-orange-200 shadow-sm">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl font-bold">
                    🚫
                </div>
                <div className="flex flex-col gap-2 max-w-md">
                    <h1 className="text-3xl font-extrabold text-gray-900">Ruxsat etilmagan! (Access Denied)</h1>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        Ushbu Host boshqaruv bo'limiga faqat tizim admini (<strong>{ADMIN_EMAIL}</strong>) kirishi mumkin. Siz esa <strong>{user?.email}</strong> akkaunti bilan kirgansiz.
                    </p>
                </div>
                <Link
                    to="/"
                    className="px-6 py-3 bg-[rgba(255,140,56,1)] text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-md"
                >
                    Bosh Sahifaga Qaytish
                </Link>
            </div>
        );
    }

    return children;
}