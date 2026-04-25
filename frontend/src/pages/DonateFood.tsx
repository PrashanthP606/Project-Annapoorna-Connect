// src/pages/DonateFood.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../lib/api";
import { extractApiMessage } from "../lib/errors";

type FoodType = "veg" | "non-veg" | "both";

const MAX_IMAGES = 6;

const baseInput: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #e6e9ee",
  fontSize: 14,
  boxSizing: "border-box",
  background: "#fff",
  transition: "box-shadow 160ms ease, border-color 160ms ease",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontSize: 13,
  color: "#374151",
};

const DonateFood: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [foodType, setFoodType] = useState<FoodType>("veg");
  const [quantity, setQuantity] = useState<number>(1);
  const [pickupAddress, setPickupAddress] = useState("");
  const [lng, setLng] = useState<number | "">("");
  const [lat, setLat] = useState<number | "">("");
  
  // CHANGED: Store hours as a number instead of a date string
  const [expiresInHours, setExpiresInHours] = useState<number | "">(6);

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Camera State & Refs ---
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setImagePreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [images]);

  // --- Camera Functions ---

  const startCamera = async () => {
    if (images.length >= MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please ensure permissions are granted.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const fileName = `camera_${Date.now()}.jpg`;
          const file = new File([blob], fileName, { type: "image/jpeg" });
          setImages((prev) => {
            if (prev.length >= MAX_IMAGES) return prev;
            return [...prev, file];
          });
          stopCamera();
        }
      }, "image/jpeg", 0.8);
    }
  };

  const validate = (): string | null => {
    if (!title.trim()) return "Title is required";
    if (!description.trim()) return "Description is required";
    if (!Number.isFinite(quantity) || quantity <= 0)
      return "Quantity must be greater than 0";
    if (!pickupAddress.trim()) return "Pickup address is required";
    if (lng === "" || lat === "")
      return "Pickup longitude and latitude are required";
    if (!isFinite(Number(lng)) || !isFinite(Number(lat)))
      return "Latitude and longitude must be valid numbers";
    if (images.length === 0) return "At least one image is required";
    
    // Validate hours if provided
    if (expiresInHours !== "" && Number(expiresInHours) <= 0) {
      return "Expiry hours must be greater than 0";
    }
    return null;
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imagesOnly = files.filter((f) => f.type.startsWith("image/"));

    setImages((prev) => {
      const key = (f: File) => `${f.name}_${f.size}_${f.lastModified}`;
      const existingKeys = new Set(prev.map(key));
      const merged = [...prev];
      for (const f of imagesOnly) {
        if (merged.length >= MAX_IMAGES) break;
        if (!existingKeys.has(key(f))) {
          merged.push(f);
          existingKeys.add(key(f));
        }
      }
      return merged.slice(0, MAX_IMAGES);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUseMyLocation = async () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation not available in this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(6)));
        setLng(Number(pos.coords.longitude.toFixed(6)));
      },
      (err) => {
        alert("Could not get location: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      alert(v);
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      form.append("foodType", foodType);
      form.append("quantity", String(quantity));
      form.append("pickupAddress", pickupAddress);

      const pickupLocation = {
        type: "Point",
        coordinates: [Number(lng), Number(lat)],
      };
      form.append("pickupLocation", JSON.stringify(pickupLocation));

      // CHANGED: Calculate ISO string based on current time + hours
      if (expiresInHours !== "") {
        const hours = Number(expiresInHours);
        const expiryDate = new Date(Date.now() + hours * 60 * 60 * 1000);
        form.append("expiresAt", expiryDate.toISOString());
      }

      images.forEach((file) => {
        form.append("images", file);
      });

      const res = await api.post("/donations", form);

      const id = res.data?._id ?? null;
      alert("Donation created" + (id ? `: ${id}` : "."));

      // reset form
      setTitle("");
      setDescription("");
      setFoodType("veg");
      setQuantity(1);
      setPickupAddress("");
      setLng("");
      setLat("");
      setExpiresInHours(6); // Reset to default 6 hours
      setImages([]);
      setImagePreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      alert(extractApiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const imagePreviewGrid = useMemo(
    () => (
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
        {imagePreviews.map((src, i) => (
          <div
            key={i}
            style={{
              width: 110,
              height: 110,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 6px 18px rgba(16,24,40,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f8fafc",
              position: "relative",
              border: "1px solid rgba(15,23,42,0.03)",
            }}
          >
            <img
              src={src}
              alt={`preview-${i}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              title="Remove"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    ),
    [imagePreviews]
  );

  // Helper to show calculated time for user reference
  const calculatedExpiryTime = useMemo(() => {
    if (expiresInHours === "" || Number(expiresInHours) <= 0) return null;
    const d = new Date(Date.now() + Number(expiresInHours) * 60 * 60 * 1000);
    return d.toLocaleString([], { 
      weekday: 'short', 
      hour: '2-digit', 
      minute: '2-digit',
      day: 'numeric',
      month: 'short'
    });
  }, [expiresInHours]);

  return (
    <div style={{ maxWidth: 760, margin: "28px auto", padding: 24, fontFamily: "Inter, Arial, sans-serif" }}>
      <div
        style={{
          padding: 22,
          borderRadius: 14,
          background: "linear-gradient(180deg, rgba(11,108,255,0.05), rgba(255,255,255,0.8))",
          boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
          border: "1px solid rgba(11,108,255,0.06)",
        }}
      >
        <header style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 8 }}>
          <div
            aria-hidden
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "linear-gradient(135deg,#0b6cff,#3b82f6)",
              display: "grid",
              placeItems: "center",
              color: "white",
              fontWeight: 700,
              fontSize: 20,
              boxShadow: "0 8px 20px rgba(11,108,255,0.12)",
            }}
          >
            🍽
          </div>
          <div>
            <h2 style={{ margin: 0, color: "#0f172a" }}>Donate Food</h2>
            <p style={{ margin: 0, color: "#475569", fontSize: 13 }}>
              Share a meal — add details and photos. Volunteers nearby can claim before it expires.
            </p>
          </div>
        </header>

        <form onSubmit={handleCreate}>
          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <label style={labelStyle}>
                Title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g. 2 boxes of idli & chutney"
                  style={{ ...baseInput, marginTop: 8 }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = "0 6px 18px rgba(11,108,255,0.08)")}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                />
              </label>

              <label style={{ ...labelStyle, marginTop: 8 }}>
                Description
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description (ingredients, reheating notes, allergens...)"
                  rows={4}
                  style={{ ...baseInput, marginTop: 8, resize: "vertical", minHeight: 96 }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = "0 6px 18px rgba(11,108,255,0.08)")}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                />
              </label>

              <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginTop: 6 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>
                    Food type
                    <select
                      value={foodType}
                      onChange={(e) => setFoodType(e.target.value as FoodType)}
                      style={{ ...baseInput, marginTop: 8 }}
                    >
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-vegetarian</option>
                      <option value="both">Both / mixed</option>
                    </select>
                  </label>
                </div>

                
              </div>

              <div >
                  <label style={labelStyle}>
                    Phone number
                    <input
                      value={quantity}
                      type="input"
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      style={{ ...baseInput, marginTop: 8 }}
                    />
                  </label>
                </div>

              <label style={{ ...labelStyle, marginTop: 8 }}>
                Pickup address
                <input
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Street, area, city"
                  style={{ ...baseInput, marginTop: 8 }}
                />
              </label>

              <div style={{ display: "flex", gap: 10, marginTop: 8, alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>
                    Longitude
                    <input
                      value={lng}
                      onChange={(e) => setLng(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="77.6"
                      style={{ ...baseInput, marginTop: 8 }}
                    />
                  </label>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>
                    Latitude
                    <input
                      value={lat}
                      onChange={(e) => setLat(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="12.97"
                      style={{ ...baseInput, marginTop: 8 }}
                    />
                  </label>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(14,165,233,0.12)",
                      background: "#fff",
                      cursor: "pointer",
                      boxShadow: "0 6px 18px rgba(2,6,23,0.04)",
                      fontSize: 13,
                    }}
                  >
                    Use my location
                  </button>
                </div>
              </div>

              {/* CHANGED: Expires In (Hours) Input */}
              <label style={{ ...labelStyle, marginTop: 10 }}>
                Expires in (hours)
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={expiresInHours}
                  onChange={(e) => setExpiresInHours(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 6"
                  style={{ ...baseInput, marginTop: 8 }}
                />
                <div style={{ marginTop: 4, color: "#64748b", fontSize: 12, display: "flex", justifyContent: "space-between" }}>
                  <span>Leave blank for no expiry</span>
                  {calculatedExpiryTime && (
                    <span style={{ color: "#0b6cff", fontWeight: 500 }}>
                      Will expire: {calculatedExpiryTime}
                    </span>
                  )}
                </div>
              </label>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, color: "#374151" }}>
                Photos (max {MAX_IMAGES})
              </label>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <label
                  htmlFor="file"
                  style={{
                    flex: "0 0 auto",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px dashed rgba(15,23,42,0.06)",
                    background: "#ffffff",
                    cursor: "pointer",
                    fontSize: 13,
                    color: "#0b6cff",
                    boxShadow: "0 6px 18px rgba(2,6,23,0.02)",
                  }}
                >
                  + Upload photos
                </label>
                <input
                  id="file"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesChange}
                  style={{ display: "none" }}
                />

                 <button
                  type="button"
                  onClick={startCamera}
                  style={{
                    flex: "0 0 auto",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(15,23,42,0.06)",
                    background: "#ffffff",
                    cursor: "pointer",
                    fontSize: 13,
                    color: "#374151",
                    boxShadow: "0 6px 18px rgba(2,6,23,0.02)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  📷 Use Camera
                </button>

                <div style={{ color: "#64748b", fontSize: 13 }}>
                  {images.length}/{MAX_IMAGES} selected
                </div>
              </div>

              {imagePreviews.length > 0 ? (
                imagePreviewGrid
              ) : (
                <div
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    background: "#f8fafc",
                    color: "#64748b",
                    marginTop: 12,
                    border: "1px solid rgba(15,23,42,0.03)",
                  }}
                >
                  No photos selected
                </div>
              )}

              <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "none",
                    cursor: "pointer",
                    background: "linear-gradient(90deg,#0b6cff,#3b82f6)",
                    color: "#fff",
                    fontWeight: 700,
                    boxShadow: "0 10px 30px rgba(11,108,255,0.12)",
                    transition: "transform 120ms ease",
                  }}
                >
                  {loading ? "Creating…" : "Create Donation"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setDescription("");
                    setFoodType("veg");
                    setQuantity(1);
                    setPickupAddress("");
                    setLng("");
                    setLat("");
                    setExpiresInHours(6);
                    setImages([]);
                    setImagePreviews([]);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid rgba(14,165,233,0.14)",
                    background: "#fff",
                    cursor: "pointer",
                    color: "#0b6cff",
                    fontWeight: 600,
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </form>

        <div style={{ marginTop: 18, color: "#64748b", fontSize: 13 }}>
          Tip: add clear photos and an accurate pickup address so volunteers can claim your donation faster.
        </div>
      </div>

       {/* Camera Modal Overlay */}
       {showCamera && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#000",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "calc(100% - 100px)",
              objectFit: "contain",
            }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />

          <div
            style={{
              height: 100,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              background: "#000",
            }}
          >
            <button
              type="button"
              onClick={stopCamera}
              style={{
                padding: "10px 20px",
                borderRadius: 20,
                border: "1px solid #fff",
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={capturePhoto}
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: "4px solid #fff",
                background: "transparent",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: "#fff",
                }}
              />
            </button>

            <div style={{ width: 80 }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonateFood;