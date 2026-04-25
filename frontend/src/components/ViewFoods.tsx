// src/pages/ViewFoods.tsx
import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { formatDistanceToNow } from "date-fns";
import { 
  Users, 
  MapPin, 
  Clock, 
  Image as ImageIcon, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  X 
} from "lucide-react";

type Donation = {
  _id: string;
  donorId: { _id?: string; name?: string; email?: string } | string;
  receiverId?: string | null;
  title: string;
  description?: string;
  foodType?: string;
  quantity?: number; // Using this for Phone Number
  pickupAddress?: string;
  pickupLocation?: {
    type?: "Point";
    coordinates?: number[]; // [lng, lat]
  };
  status?: string;
  images?: string[];
  availableFrom?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

const STATUS_COLORS: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-700 border-emerald-200",
  matched: "bg-amber-100 text-amber-700 border-amber-200",
  accepted: "bg-blue-100 text-blue-700 border-blue-200",
  picked_up: "bg-purple-100 text-purple-700 border-purple-200",
  completed: "bg-gray-100 text-gray-700 border-gray-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  expired: "bg-stone-100 text-stone-500 border-stone-200 grayscale",
};

const ViewFoods: React.FC = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [user, setUser] = useState<any | null>(null);
  
  // Lightbox state
  const [lightbox, setLightbox] = useState<{ 
    images: string[]; 
    currentIndex: number; 
    isOpen: boolean 
  }>({ 
    images: [], 
    currentIndex: 0, 
    isOpen: false 
  });

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { setUser(null); }
    }
  }, []);

  const getImageUrl = (src?: string) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    const clean = src.replace(/^\/+/, "");
    return `${BASE_URL}/${clean}`;
  };

  const fetchDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Donation[]>("/donations");
      setDonations(res.data || []);
    } catch (err: any) {
      console.error("Failed to load donations:", err);
      setError(err?.response?.data?.message || err.message || "Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // --- Lightbox Logic ---
  const openLightbox = (images: string[] | undefined, index: number) => {
    if (!images || images.length === 0) return;
    setLightbox({
      images: images.map(img => getImageUrl(img)),
      currentIndex: index,
      isOpen: true
    });
  };

  const closeLightbox = () => {
    setLightbox(prev => ({ ...prev, isOpen: false }));
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }));
  };

  useEffect(() => {
    if (!lightbox.isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox.isOpen]);
  // ----------------------

  // --- Map Logic ---
  const openLocationInMaps = (d: Donation) => {
    if (d.pickupLocation?.coordinates && d.pickupLocation.coordinates.length === 2) {
      const [lng, lat] = d.pickupLocation.coordinates;
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
    } else if (d.pickupAddress) {
      window.open(`https://www.google.com/maps?q=${encodeURIComponent(d.pickupAddress)}`, "_blank");
    }
  };

  const isExpired = (d: Donation) => {
    if (!d.expiresAt) return false;
    const exp = new Date(d.expiresAt).getTime();
    return !Number.isNaN(exp) && Date.now() > exp;
  };

  const getComputedStatus = (d: Donation) => {
    if (isExpired(d)) return "expired";
    return d.status || "available";
  };

  // --- UPDATED: HANDLE ACCEPT WITH NOTIFICATION ALERT ---
  const handleAccept = async (id: string) => {
    if (!user || user.role !== "receiver") {
      alert("Only users with role 'receiver' can accept food.");
      return;
    }

    // 1. Optimistic UI Update
    setDonations((prev) =>
      prev.map((d) =>
        d._id === id ? { ...d, status: "accepted", receiverId: user._id } : d
      )
    );

    try {
      // 2. Call Backend
      await api.post(`/donations/${id}/request`, {}, { 
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } 
      });

      // 3. Show Success Alert
      alert(`Success! The donor has been notified via email with your contact details (${user.name}, ${user.phone}). Please wait for them to coordinate the pickup.`);
      
      await fetchDonations();
    } catch (err: any) {
      // Revert if error
      alert(err?.response?.data?.message || "Failed to send request");
      await fetchDonations();
    }
  };

  const filtered = donations.filter((d) => {
    const s = getComputedStatus(d);
    return statusFilter === "all" ? true : s === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Available Meals</h1>
          <p className="text-slate-500 mt-2 text-lg">Browse meals donated by the community.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-xl border shadow-sm">
          <span className="pl-3 text-sm font-medium text-slate-500">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-slate-700 font-medium py-2 pl-2 pr-8 outline-none cursor-pointer"
          >
            <option value="all">Show All</option>
            <option value="available">Available</option>
            <option value="accepted">Accepted</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {loading && <div className="text-center py-20 text-slate-400">Loading donations...</div>}
      {!loading && filtered.length === 0 && <div className="text-center py-20 bg-slate-50 rounded-xl">No donations found.</div>}

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((donation) => {
          const expired = isExpired(donation);
          const computedStatus = getComputedStatus(donation);
          const badgeClass = STATUS_COLORS[computedStatus] || "bg-gray-100";

          return (
            <article 
              key={donation._id} 
              className={`group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${expired ? "opacity-80" : ""}`}
            >
              <div className="p-5 flex gap-5">
                {/* Main Image */}
                <div 
                  className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 cursor-pointer group-hover:ring-2 group-hover:ring-blue-100 transition-all"
                  onClick={() => openLightbox(donation.images, 0)}
                >
                  {donation.images && donation.images.length > 0 ? (
                    <img
                      src={getImageUrl(donation.images[0])}
                      alt={donation.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/fallback-image.png"; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                  {donation.images && donation.images.length > 1 && (
                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md font-medium backdrop-blur-sm">
                      +{donation.images.length - 1}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${badgeClass}`}>
                      {computedStatus.replace("_", " ")}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {donation.foodType === 'veg' ? '🥬 Veg' : donation.foodType === 'non-veg' ? '🍗 Non-Veg' : '🥘 Mixed'}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
                    {donation.title}
                  </h2>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                    {donation.description || "No description available."}
                  </p>
                </div>
              </div>

              <div className="h-px bg-slate-100 mx-5" />

              <div className="px-5 py-4 space-y-2.5 bg-slate-50/50">
                
                {/* Phone Number */}
                <div className="mt-auto text-sm font-medium text-slate-700">
                    Phone number:{" "}
                    <a 
                      href={`tel:${donation.quantity ?? ''}`}
                      onClick={(e) => e.stopPropagation()} 
                      className="text-slate-900 hover:text-blue-600 hover:underline decoration-blue-600 transition-all cursor-pointer"
                    >
                      {donation.quantity ?? "N/A"}
                    </a>
                </div>

                {/* Location */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    openLocationInMaps(donation);
                  }}
                  className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer hover:text-blue-600 transition-colors group/loc"
                  title="Open in Google Maps"
                >
                  <MapPin className="w-4 h-4 text-slate-400 group-hover/loc:text-blue-600" />
                  <span className="truncate underline decoration-dotted decoration-slate-300 hover:decoration-blue-600">
                    {donation.pickupAddress || "View Location"}
                  </span>
                </div>

                <div className={`flex items-center gap-2.5 text-sm ${expired ? "text-red-600 bg-red-50 px-2 py-1 rounded-md -ml-2 w-fit" : "text-amber-600"}`}>
                  {expired ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  <span className="font-medium">
                    {donation.expiresAt 
                      ? `${expired ? "Expired" : "Expires"} ${formatDistanceToNow(new Date(donation.expiresAt), { addSuffix: true })}`
                      : "No expiry date"}
                  </span>
                </div>
              </div>

              <div className="p-4 pt-0 mt-auto flex gap-3">
                {user?.role === "receiver" && !expired && computedStatus === "available" && (
                  <button
                    onClick={() => handleAccept(donation._id)}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
                  >
                    Claim Food
                  </button>
                )}
                <button
                  onClick={() => openLightbox(donation.images, 0)}
                  className={`flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors ${(!user?.role || user.role !== 'receiver' || expired) ? 'w-full' : ''}`}
                >
                  View Photos
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightbox.isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300"
          onClick={closeLightbox}
        >
          <button 
            onClick={closeLightbox} 
            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {lightbox.images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 z-50 bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          <div className="relative max-w-5xl w-full max-h-screen p-4 flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={lightbox.images[lightbox.currentIndex]} 
              alt={`Gallery ${lightbox.currentIndex + 1}`} 
              className="w-auto h-auto max-h-[80vh] max-w-full object-contain rounded-sm shadow-2xl" 
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/fallback-image.png"; }} 
            />
            
            {lightbox.images.length > 1 && (
              <div className="mt-4 text-white/80 bg-black/40 px-4 py-1 rounded-full text-sm font-medium">
                {lightbox.currentIndex + 1} / {lightbox.images.length}
              </div>
            )}
          </div>

          {lightbox.images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 z-50 bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewFoods;