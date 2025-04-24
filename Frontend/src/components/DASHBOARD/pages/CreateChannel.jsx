import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useChannel } from "../../../hooks/useChannel";
import { Radio, Check, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import formBG from "../../../assets/form_bg.svg";

/** 
 * Displays success message after successful channel creation 
 */
const SuccessMessage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col items-center justify-center p-8 text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
      className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4"
    >
      <Check className="w-8 h-8 text-success" />
    </motion.div>
    <h3 className="text-xl font-semibold text-base-content mb-2">Channel Created Successfully!</h3>
    <p className="text-base-content/70">Redirecting to dashboard...</p>
  </motion.div>
);

/** 
 * Form field component with built-in animation and error display 
 */
const FormField = ({ label, name, value, onChange, type = "text", placeholder, error }) => {
  const inputClasses = useMemo(
    () =>
      `input input-bordered w-full ${
        type === "textarea" ? "resize-none h-28" : ""
      } ${error ? "border-error/50" : ""}`,
    [error, type]
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: name === "name" ? 0.2 : 0.3 }}
      className="form-control w-full"
    >
      <label className="label">
        <span className="label-text text-base-content/80">{label}</span>
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
          placeholder={placeholder}
          required
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
          placeholder={placeholder}
          required
        />
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-error text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

/**
 * Message shown if user already has a channel
 */
const ExistingChannelMessage = ({ navigate }) => (
  <div className="min-h-[400px] flex items-center justify-center p-6">
    <div className="max-w-md w-full bg-base-100 rounded-xl shadow-md">
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-success/20 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Check className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-3">Channel Already Created</h2>
        <p className="text-base-content/70 mb-4">
          You already have an active channel. You can manage it from the dashboard.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-primary"
        >
          Go to Dashboard
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  </div>
);

/**
 * Main component to create a channel
 */
export default function CreateChannel() {
  const { channelData, createChannel, isCreatingChannel, createChannelError } = useChannel();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = useMemo(
    () => () => {
      const errors = {};
      if (!formData.name.trim()) errors.name = "Channel name is required";
      else if (formData.name.length < 3) errors.name = "Minimum 3 characters required";

      if (!formData.description.trim()) errors.description = "Description is required";
      else if (formData.description.length < 10) errors.description = "Minimum 10 characters required";

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [formData]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createChannel({
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
      setIsSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.error("Channel creation failed:", error);
      setFormErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to create channel. Please try again.",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null, submit: null }));
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto bg-base-100 rounded-xl shadow-md"
      >
        <SuccessMessage />
      </motion.div>
    );
  }

  if (channelData) return <ExistingChannelMessage navigate={navigate} />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto px-4">
      <div className="bg-base-300 rounded-xl shadow-lg overflow-hidden w-full">
        <div className="md:flex w-full">
          {/* Form Section */}
          <div className="p-6 pt-10 md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Radio className="w-8 h-8 text-secondary" />
                <div>
                  <h2 className="text-2xl font-bold text-accent">Create Your Channel</h2>
                  <p className="text-info">Share your content with the world</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                  label="Channel Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your channel name"
                  error={formErrors.name}
                />

                <FormField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  type="textarea"
                  placeholder="Tell us about your channel"
                  error={formErrors.description}
                />

                {(createChannelError || formErrors.submit) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-error text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{createChannelError?.message || formErrors.submit}</span>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isCreatingChannel}
                  className="btn btn-accent w-full flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isCreatingChannel ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Channel
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Right Image Section */}
          <div className="hidden md:block md:w-1/2 bg-transparent p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="h-full flex items-center justify-center"
            >
              <img
                src={formBG}
                alt="Create Channel Illustration"
                className="max-w-full h-auto"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
