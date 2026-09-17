import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login({ onLogin }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loginWithGoogle } = useAuth();

    const from = location.state?.from?.pathname || '/';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [googleSubmitting, setGoogleSubmitting] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError("Iltimos, barcha maydonlarni to'ldiring!");
            return;
        }

        try {
            setSubmitting(true);
            await login(email, password);
            if (onLogin) {
                onLogin({ email });
            }
            navigate(from, { replace: true });
        } catch (err) {
            console.error("Login xatosi:", err);
            setError(err.message || "Email yoki parol noto'g'ri!");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleGoogleLogin() {
        setError('');
        try {
            setGoogleSubmitting(true);
            await loginWithGoogle();
        } catch (err) {
            console.error("Google Auth xatosi:", err);
            setError(err.message || "Google orqali kirishda xatolik yuz berdi");
            setGoogleSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col items-center gap-4 max-w-md w-[92%] sm:w-full p-6 sm:p-10 rounded-2xl mx-auto shadow-xl my-10 sm:my-16 text-center bg-[rgba(255,247,237,1)] border border-orange-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Sign in to your account</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl w-full text-sm">
                    {error}
                </div>
            )}

            {/* Google Sign In Button */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleSubmitting}
                className="w-full mt-2 py-3 px-4 bg-white border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition flex items-center justify-center gap-3 shadow-xs cursor-pointer disabled:opacity-50"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                </svg>
                {googleSubmitting ? "Google orqali kirilmoqda..." : "Google bilan kirish (Sign in with Google)"}
            </button>

            {/* Divider */}
            <div className="flex items-center w-full my-2">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-xs text-gray-500 font-medium uppercase">yoki email bilan</span>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-3 w-full">
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-3 rounded-xl w-full bg-white text-sm sm:text-base border-gray-300 outline-none focus:ring-2 focus:ring-orange-500"
                        type="email"
                        required
                        placeholder="Your working email"
                    />

                    <div className="relative w-full">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border p-3 pr-10 rounded-xl w-full bg-white text-sm sm:text-base border-gray-300 outline-none focus:ring-2 focus:ring-orange-500"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 cursor-pointer focus:outline-none"
                            aria-label={showPassword ? "Parolni berkitish" : "Parolni ko'rsatish"}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c1.274 4.057 5.065 7 9.542 7 4.477 0 8.268-2.943 9.542-7-1.274-4.057-5.064-7-9.542-7-4.477 0-8.268 2.943-9.542 7z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 bg-[rgba(247,94,5,1)] text-white p-3 rounded-xl w-full font-bold hover:bg-orange-600 transition cursor-pointer disabled:opacity-50 shadow-md"
                >
                    {submitting ? "Kirilmoqda..." : "Kirish"}
                </button>
            </form>

            <div className="flex items-center gap-1 text-sm mt-2">
                <span className="text-gray-600">Don't have an account?</span>
                <NavLink to="/register" className="text-[rgba(247,94,5,1)] font-bold underline">Sign Up</NavLink>
            </div>
        </div>
    );
}