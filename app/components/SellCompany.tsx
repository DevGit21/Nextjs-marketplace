"use client";

import { useState } from "react";
import { supabase } from "@/supabase/config"; 
import { useRouter } from "next/navigation";

export default function SellCompany() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [industry, setIndustry] = useState(""); 
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    // Fetch the logged-in user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      setError("You must be logged in to sell a company.");
      setLoading(false);
      return;
    }

    // Handle image upload if an image is provided
    let imageUrl = "";
    if (image) {
      // Upload image to Supabase storage
      const fileExt = image.name.split(".").pop();
      const fileName = `${userData.user.id}-${Date.now()}.${fileExt}`;
      
      const { data: imageData, error: imageError } = await supabase
        .storage
        .from("company-images")
        .upload(fileName, image);
      
      if (imageError) {
        setError("Image upload failed: " + imageError.message);
        setLoading(false);
        return;
      }

      // Get the public URL of the uploaded image
      const { data } = supabase
        .storage
        .from("company-images")
        .getPublicUrl(imageData.path); // Get the public URL using the correct structure

      if (data) {
        imageUrl = data.publicUrl || ""; // Access the publicUrl if data exists
      } else {
        setError("Error fetching public URL");
        setLoading(false);
        return;
      }
    }

    // Insert company data into the database
    const { error } = await supabase
      .from("companies")
      .insert([
        {
          name,
          description,
          price: parseFloat(price),
          industry, 
          seller_id: userData.user.id,
          image_url: imageUrl,
        },
      ]);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    alert("Company listed successfully!");
    router.push("/"); // Redirect to marketplace page
    setLoading(false);
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Sell Your Company</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Company Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-3"
          required
        />

        <textarea
          placeholder="Company Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-3"
        />

        <input
          type="number"
          placeholder="Asking Price ($)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-3"
          required
        />

        {/* Industry Type Dropdown */}
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-3"
          required
        >
          <option value="">Select Industry Type</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Retail">Retail</option>
          <option value="Marketing">Marketing</option>
        </select>

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          className="w-full p-2 border border-gray-300 rounded mb-3"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Submitting..." : "List Company"}
        </button>
      </form>
    </div>
  );
}
