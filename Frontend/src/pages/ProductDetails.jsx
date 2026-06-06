import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Star, User, MessageSquare, Plus, CheckCircle } from "lucide-react";
import Heroimage from "../assets/product_details_hero.png";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        const mappedProduct = {
          ...data,
          name: data.productName || data.name,
          price: data.productPrice || data.price,
          image: data.productImage || data.image,
          countInStock: data.productQuantity || data.countInStock || 0
        };
        setProduct(mappedProduct);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/product/${id}`);
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to share your experience.");
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error("Please provide a comment.");
      return;
    }

    try {
      setSubmittingReview(true);
      await api.post("/reviews", {
        product: id,
        rating: newReview.rating,
        comment: newReview.comment
      });
      toast.success("Review submitted successfully.");
      setNewReview({ rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg tracking-wide">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black text-white relative">
      <div className="absolute top-0 left-0 w-full h-[60vh] overflow-hidden">
        <img
          src={Heroimage}
          alt="Luxury Essence"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-start relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="rounded-3xl overflow-hidden bg-white shadow-2xl border border-white/20 aspect-[4/5]"
        >
          <img
            src={product.image
              ? (product.image.startsWith('http') || product.image.startsWith('data:') ? product.image : `${import.meta.env.VITE_API_URL.replace('/api', '')}${product.image}`)
              : "https://via.placeholder.com/600x700?text=Perfume"}
            alt={product.name}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[3s] ease-out"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="pt-8 md:pt-20"
        >
          <div className="space-y-8">
            <div className="space-y-4">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xs uppercase tracking-[0.5em] text-amber-600 font-bold"
              >
                {product.category || "Luxury Collection"}
              </motion.p>

              <h1 className="text-5xl md:text-6xl font-serif tracking-tight leading-none text-white">
                {product.name}
              </h1>

              <div className="flex items-center gap-6">
                <p className="text-3xl font-light tracking-widest text-amber-400">
                  Rs. {product.price.toLocaleString()}
                </p>
                <div className="h-px flex-1 bg-white/10" />
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed font-sans text-lg max-w-lg">
              {product.description || "An olfactory journey crafted with the finest essences, designed to linger in memory as an invisible accessory of power."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-y border-white/5 py-8">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Brand</span>
                <p className="font-serif text-lg">{product.brand || "Élan Fragrance"}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Availability</span>
                <p className={`font-serif text-lg ${product.countInStock > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {product.countInStock > 0 ? `In Stock (${product.countInStock} units)` : "Out of Stock"}
                </p>
              </div>
            </div>

            {product.countInStock > 0 && (
              <div className="flex flex-col gap-6 pt-4">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Select Quantity</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                    >-</button>
                    <span className="w-10 text-center font-bold text-white">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                    >+</button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => addToCart(product, qty)}
                    className="flex-1 px-8 py-5 rounded-full bg-white text-black font-bold uppercase tracking-widest text-[11px] hover:bg-amber-600 hover:text-white transform active:scale-95 transition-all shadow-xl shadow-black/20"
                  >
                    Add to Cart — Rs. {(product.price * qty).toLocaleString()}
                  </button>
                  <button
                    onClick={() => navigate('/cart')}
                    className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all transform active:scale-95 group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="max-w-7xl mx-auto px-6 pb-32 space-y-20 relative z-10">
        <div className="h-px bg-white/5 w-full" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Review Form */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-amber-600 font-bold">Feedback</span>
              <h2 className="text-4xl font-serif">Leave a Review</h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">Share your olfactory journey with others. Your perspective helps our collective grow.</p>
            </div>

            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-8 bg-zinc-900/30 p-10 rounded-[40px] border border-white/5">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 block">Rating</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="text-amber-500 hover:scale-110 transition-transform"
                      >
                        <Star size={24} fill={star <= newReview.rating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 block">Comment</span>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Describe the scent, the longevity, the aura..."
                    className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 text-sm focus:border-amber-500 outline-none transition-all min-h-[120px] resize-none placeholder:text-zinc-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-amber-600 hover:text-white transition-all disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Post Review"}
                </button>
              </form>
            ) : (
              <div className="bg-zinc-900/30 p-10 rounded-[40px] border border-white/5 text-center space-y-6">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-white/5">
                  <Plus size={24} className="text-zinc-700" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-serif">Want to share your experience?</h4>
                  <p className="text-sm text-zinc-500 max-w-[240px] mx-auto">Please login to your account to submit a review for this product.</p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full transition-all"
                >
                  Login to Review
                </button>
              </div>
            )}
          </div>

          {/* Right: Review List */}
          <div className="lg:col-span-7 space-y-12">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-serif">Customer Experiences</h3>
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{reviews.length} Reflections</span>
            </div>

            {reviews.length === 0 ? (
              <div className="py-20 text-center bg-zinc-950/20 rounded-[40px] border border-dashed border-white/5">
                <MessageSquare size={40} className="mx-auto text-zinc-800 mb-6" />
                <p className="text-zinc-500 text-sm italic font-serif">Be the first to describe this olfactory journey.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {reviews.map((review) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-zinc-950 border border-white/5 p-8 rounded-[32px] space-y-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5">
                          <User size={16} className="text-zinc-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white">
                            {review.name || (review.user?.firstName ? `${review.user.firstName} ${review.user.lastName}` : "Anonymous")}
                          </p>
                          <div className="flex gap-1 text-amber-500 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={8} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={1} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed italic">"{review.comment}"</p>
                    <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest text-emerald-500/50 font-bold">
                      <CheckCircle size={10} /> Verified Purchase
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;