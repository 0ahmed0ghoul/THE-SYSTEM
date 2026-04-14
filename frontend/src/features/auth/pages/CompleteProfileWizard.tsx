import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function CompleteProfileWizard() {
  const navigate = useNavigate();
  const { updateProfile } = useAuthStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    position: "",
    department: "",
    rank: "",
    bio: "",
    github: "",
    linkedin: "",
    website: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submit = async () => {
    try {
      setLoading(true);

      await updateProfile({
        ...form,
        is_profile_complete: true,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b12] text-white">
      <div className="w-[600px] p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">

        {/* Header */}
        <h1 className="text-2xl font-bold mb-1">Complete Your Profile</h1>
        <p className="text-sm text-white/60 mb-6">
          Step {step} of 3
        </p>

        {/* Progress bar */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-8">
          <div
            className="h-1 bg-purple-500 rounded-full transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-3">
            <input name="name" placeholder="Full Name" onChange={handleChange} className="input" />
            <input name="phone" placeholder="Phone" onChange={handleChange} className="input" />
            <input name="location" placeholder="Location" onChange={handleChange} className="input" />
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-3">
            <input name="position" placeholder="Position" onChange={handleChange} className="input" />
            <input name="department" placeholder="Department" onChange={handleChange} className="input" />
            <input name="rank" placeholder="Rank" onChange={handleChange} className="input" />
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-3">
            <textarea name="bio" placeholder="Bio" onChange={handleChange} className="input h-24" />
            <input name="github" placeholder="GitHub" onChange={handleChange} className="input" />
            <input name="linkedin" placeholder="LinkedIn" onChange={handleChange} className="input" />
            <input name="website" placeholder="Website" onChange={handleChange} className="input" />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={back}
            disabled={step === 1}
            className="px-4 py-2 bg-white/10 rounded-lg disabled:opacity-30"
          >
            Back
          </button>

          {step < 3 ? (
            <button
              onClick={next}
              className="px-4 py-2 bg-purple-600 rounded-lg"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={loading}
              className="px-4 py-2 bg-green-600 rounded-lg"
            >
              {loading ? "Saving..." : "Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}