import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { HiOutlineUser, HiOutlineLogout, HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

function Navbar() {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/");
        setIsMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Initial check in case page starts scrolled
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isMobileMenuOpen]);

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/about", label: "About" },
        { path: "/contact", label: "Contact" },
        { path: "/products", label: "Products" },
        { path: "/reviews", label: "Reviews" },
    ];

    return (
        <>
            <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] min-[830px]:w-[90%] z-50">
                <nav className={`relative overflow-hidden flex items-center justify-between px-4 min-[830px]:px-6 py-3 rounded-4xl transition-all duration-500 linear
                    ${isScrolled
                        ? "bg-black/95 backdrop-blur-2xl border-none shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                        : "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
                    } text-white group`}>

                    <div className="absolute top-0 -inset-full h-full w-full liquid-shimmer opacity-20 pointer-events-none" />

                    <div className="flex items-center gap-2">
                        {/* Mobile Menu Button */}
                        <button
                            className="min-[800px]:hidden p-2 hover:text-amber-500 transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <HiMenu className="w-5 h-5" />
                        </button>

                        <Link to="/" className="text-lg min-[800px]:text-xl font-serif tracking-widest">
                            Élan Fragrance
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden min-[800px]:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
                        {navLinks.map((link) => (
                            <Link key={link.path} to={link.path} className="hover:text-amber-500 transition-colors duration-300">
                                {link.label}
                            </Link>
                        ))}
                        {user?.isAdmin && (
                            <Link to="/admin/dashboard" className="text-amber-500 font-bold border-b border-amber-500/30 pb-0.5 hover:text-white hover:border-white transition-all duration-300">Admin Panel</Link>
                        )}
                        {user?.isSeller && (
                            <Link to="/seller/dashboard" className="text-amber-500 font-bold border-b border-amber-500/30 pb-0.5 hover:text-white hover:border-white transition-all duration-300">Seller Panel</Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4 min-[800px]:gap-6">
                        {!user ? (
                            <Link to="/login" className="hidden min-[800px]:block text-[10px] uppercase font-bold tracking-widest hover:text-amber-500 transition-colors duration-300">
                                Log In
                            </Link>
                        ) : (
                            <div className="hidden min-[800px]:flex items-center gap-4">
                                <Link to="/profile" className="flex items-center gap-2 group/profile transition-all duration-300">
                                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover/profile:border-amber-500/50 transition-colors duration-300">
                                        <HiOutlineUser className="w-4 h-4 group-hover/profile:text-amber-500 transition-colors duration-300" />
                                    </div>
                                    <span className="hidden lg:block text-[10px] uppercase font-bold tracking-widest group-hover/profile:text-amber-500 transition-colors duration-300">
                                        {user.firstName || "Profile"}
                                    </span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="p-2 hover:text-amber-500 transition-colors duration-300 transform active:scale-95"
                                    title="Logout"
                                >
                                    <HiOutlineLogout className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <Link to="/cart" className="relative group/cart transition-all duration-300 mr-2 min-[800px]:mr-0">
                            <svg
                                className="w-5 h-5 group-hover/cart:text-amber-500 transition-colors duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="absolute -top-1 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[7px] font-black text-white shadow-sm transition-transform duration-300 group-hover/cart:scale-110">
                                {cartCount}
                            </span>
                        </Link>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-3xl min-[800px]:hidden flex flex-col"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <span className="text-xl font-serif tracking-widest text-white">Élan Fragrance</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <HiX className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                            <div className="flex flex-col gap-4 text-sm uppercase tracking-[0.2em] font-medium">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-white hover:text-amber-500 transition-colors py-2 border-b border-white/5"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                {user?.isAdmin && (
                                    <Link
                                        to="/admin/dashboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-amber-500 py-2 border-b border-white/5"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                {user?.isSeller && (
                                    <Link
                                        to="/seller/dashboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-amber-500 py-2 border-b border-white/5"
                                    >
                                        Seller Panel
                                    </Link>
                                )}
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/10">
                                {!user ? (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-center w-full py-3 bg-amber-600 text-black text-xs uppercase tracking-widest font-bold rounded-xl"
                                    >
                                        Log In
                                    </Link>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 text-white py-2"
                                        >
                                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                                                <HiOutlineUser className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <span className="text-xs uppercase font-bold tracking-widest">
                                                {user.firstName || "My Profile"}
                                            </span>
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-widest font-bold rounded-xl transition-colors"
                                        >
                                            <HiOutlineLogout className="w-4 h-4" />
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Navbar;


