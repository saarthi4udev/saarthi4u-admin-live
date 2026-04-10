import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCollegeById, updateCollege } from "../../api/api";
import ReactQuill from "react-quill";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export default function UpdateCollegeTab({ collegeId }: any) {
  const [form, setForm] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isForeignState, setIsForeignState] = useState(false);

  // ✅ Logo states
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // ✅ Banner states
  const [newBannerFile, setNewBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  // Fetch college data
  useEffect(() => {
    getCollegeById(collegeId)
      .then((res) => {
        const college = res.data.data;
        setForm(college);
        // ✅ Seed previews with existing images
        if (college.logo) setLogoPreview(college.logo);
        if (college.bannerImg) setBannerPreview(college.bannerImg);
      })
      .catch(() => toast.error("Failed to load college"));
  }, [collegeId]);

  useEffect(() => {
    if (form?.state && !indianStates.includes(form.state)) setIsForeignState(true);
  }, [form]);

  useEffect(() => {
    if (form?.country && form.country !== "India") setIsForeignState(true);
  }, [form?.country]);

  // ✅ Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (newLogoFile && logoPreview) URL.revokeObjectURL(logoPreview);
      if (newBannerFile && bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [logoPreview, bannerPreview]);

  const handleChange = (e: any) => {
    const { id, value, type, checked } = e.target;
    setForm({ ...form, [id]: type === "checkbox" ? checked : value });
  };

  // ✅ Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Handle banner file selection
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Remove logo
  const handleRemoveLogo = () => {
    setNewLogoFile(null);
    setLogoPreview(null);
    setForm((prev: any) => ({ ...prev, logo: "" }));
  };

  // ✅ Remove banner
  const handleRemoveBanner = () => {
    setNewBannerFile(null);
    setBannerPreview(null);
    setForm((prev: any) => ({ ...prev, bannerImg: "" }));
  };

  const handleUpdate = async () => {
    try {
      // ✅ Build FormData
      const formData = new FormData();
      formData.append("name", form.name || "");
      formData.append("type", form.type || "");
      formData.append("establishedYear", form.establishedYear || "");
      formData.append("affiliation", form.affiliation || "");
      formData.append("city", form.city || "");
      formData.append("state", form.state || "");
      formData.append("country", form.country || "");
      formData.append("overview", form.overview || "");
      formData.append("metaDescription", form.metaDescription || "");
      formData.append("visible", String(form.visible));

      // ✅ Logo: new file → send file, no file → keep existing URL, both empty → clear
      if (newLogoFile) {
        formData.append("logo", newLogoFile);
      } else if (form.logo) {
        formData.append("logo", form.logo);
      }

      // ✅ Banner: same logic
      if (newBannerFile) {
        formData.append("bannerImg", newBannerFile);
      } else if (form.bannerImg) {
        formData.append("bannerImg", form.bannerImg);
      }

      await updateCollege(collegeId, formData);
      toast.success("College updated successfully");
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="col-span-12">
      <p className="font-bold text-xl mb-6">Update College</p>

      <div className="add-adminForm">

        {/* Name */}
        <label className="add-adminLabel">Name</label>
        <input
          className="add-adminInput"
          placeholder="Enter College Name"
          id="name"
          value={form.name || ""}
          onChange={handleChange}
        />

        {/* Logo Upload */}
        <label className="add-adminLabel">College Logo</label>
        <input
          type="file"
          className="add-adminInput"
          accept="image/*"
          onChange={handleLogoChange}
        />
        {/* ✅ Logo Preview */}
        {logoPreview && (
          <div className="mt-2 mb-4 relative w-fit">
            <img
              src={logoPreview}
              alt="Logo Preview"
              className="h-24 w-24 rounded-md object-contain border border-gray-300 bg-gray-50"
            />
            <span className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
              {newLogoFile ? "New Logo" : "Current Logo"}
            </span>
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded"
            >
              ✕
            </button>
          </div>
        )}

        {/* Banner Upload */}
        <label className="add-adminLabel">Banner Image</label>
        <input
          type="file"
          className="add-adminInput"
          accept="image/*"
          onChange={handleBannerChange}
        />
        {/* ✅ Banner Preview */}
        {bannerPreview && (
          <div className="mt-2 mb-4 relative w-fit">
            <img
              src={bannerPreview}
              alt="Banner Preview"
              className="h-40 w-full max-w-lg rounded-md object-cover border border-gray-300"
            />
            <span className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
              {newBannerFile ? "New Banner" : "Current Banner"}
            </span>
            <button
              type="button"
              onClick={handleRemoveBanner}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded"
            >
              ✕
            </button>
          </div>
        )}

        {/* Type */}
        <label className="add-adminLabel">Type</label>
        <select className="add-adminInput" id="type" value={form.type || ""} onChange={handleChange}>
          <option value="college">College</option>
          <option value="university">University</option>
        </select>

        {/* Established Year */}
        <label className="add-adminLabel">Established Year</label>
        <input
          className="add-adminInput"
          id="establishedYear"
          placeholder="Eg. 1999"
          type="number"
          value={form.establishedYear || ""}
          onChange={handleChange}
        />

        {/* Affiliation */}
        <label className="add-adminLabel">Affiliation</label>
        <input
          className="add-adminInput"
          placeholder="Eg. Affiliated with Mumbai University"
          id="affiliation"
          value={form.affiliation || ""}
          onChange={handleChange}
        />

        {/* Country */}
        <label className="add-adminLabel">Country</label>
        <input
          className="add-adminInput"
          placeholder="Eg. India, USA"
          id="country"
          value={form.country || ""}
          onChange={handleChange}
        />

        {/* State */}
        <label className="add-adminLabel">State</label>
        <select
          className="add-adminInput"
          value={isForeignState ? "OTHER" : form.state || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "OTHER") {
              setIsForeignState(true);
              setForm({ ...form, state: "" });
            } else {
              setIsForeignState(false);
              setForm({ ...form, state: value });
            }
          }}
        >
          <option value="">Select State</option>
          {indianStates.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
          <option value="OTHER">Other (Foreign)</option>
        </select>

        {isForeignState && (
          <input
            className="add-adminInput mt-2"
            placeholder="Enter foreign state / province"
            value={form.state || ""}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
        )}

        {/* City */}
        <label className="add-adminLabel">City</label>
        <input
          className="add-adminInput"
          placeholder="Eg. Mumbai, Delhi"
          id="city"
          value={form.city || ""}
          onChange={handleChange}
        />

        {/* Overview */}
        <label className="add-adminLabel">Overview</label>
        <ReactQuill
          theme="snow"
          value={form.overview || ""}
          placeholder="Eg. IIT Bombay is best for BTech..."
          onChange={(value) => setForm((prev: any) => ({ ...prev, overview: value }))}
          className="bg-white mb-4 text-black"
        />

        {/* Meta Description */}
        <label className="add-adminLabel">Meta Description</label>
        <ReactQuill
          theme="snow"
          value={form.metaDescription || ""}
          placeholder="Enter Meta Description"
          onChange={(value) => setForm((prev: any) => ({ ...prev, metaDescription: value }))}
          className="bg-white mb-4 text-black"
        />

        {/* Visible */}
        <div className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            checked={form.visible}
            id="visible"
            onChange={handleChange}
          />
          <label>Visible</label>
        </div>

        <button className="add-adminButton mt-4" onClick={() => setShowModal(true)}>
          Update College
        </button>

        {showModal && (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h3 className="text-xl font-semibold mb-4">Confirm Update</h3>
                <p>Are you sure you want to update this college?</p>
                <div className="flex justify-end gap-3 mt-6">
                  <button className="text-red-500 font-bold" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button className="bg-emerald-500 px-4 py-2 rounded" onClick={handleUpdate}>
                    Yes
                  </button>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 bg-black"></div>
          </>
        )}
      </div>
    </div>
  );
}