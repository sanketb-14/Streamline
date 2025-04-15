import { useState } from "react";
import { motion } from "framer-motion";
import { useChannel } from "../../../hooks/useChannel";
import { Radio, Check, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import formBG from '../../../assets/form_bg.svg'

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
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 10,
        delay: 0.2,
      }}
      className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4"
    >
      <Check className="w-8 h-8 text-green-600" />
    </motion.div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Channel Created Successfully!</h3>
    <p className="text-gray-600">Redirecting to dashboard...</p>
  </motion.div>
);

const FormField = ({ label, name, value, onChange, type = "text", placeholder, error }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: name === "name" ? 0.2 : 0.3 }}
    className="space-y-2"
  >
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {type === "textarea" ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows="4"
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? "border-red-300" : "border-gray-300"
        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
        placeholder={placeholder}
        required
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? "border-red-300" : "border-gray-300"
        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
        placeholder={placeholder}
        required
      />
    )}
    {error && (
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-1">
        {error}
      </motion.p>
    )}
  </motion.div>
);

export default function CreateChannel() {
  const { channelData ,createChannel, isCreatingChannel, createChannelError } = useChannel();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Channel name is required";
    } else if (formData.name.length < 3) {
      errors.name = "Channel name must be at least 3 characters long";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < 10) {
      errors.description = "Description must be at least 10 characters long";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createChannel({
        name: formData.name.trim(),
        description: formData.description.trim()
      });
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Channel creation failed:", error);
      setFormErrors(prev => ({
        ...prev,
        submit: error.message || "Failed to create channel. Please try again."
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
        submit: null, // Clear submit error when user makes changes
      }));
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <SuccessMessage />
      </motion.div>
    );
  }

  const ExistingChannelMessage = () => (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gradient-to-tr from-bg-base-300 to-base-100 rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-base-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-3">Channel Already Created</h2>
          <p className=" mb-4">
            You already have an active channel. You can manage your channel through the dashboard.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if(channelData)return <ExistingChannelMessage />

//   if(!channelData){
//     return(
//         <h1>No Data Now. Create Channel </h1>
//     )
//   }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto "
    >
      <div className="bg-gradient-to-br from-transparent to-base-300 rounded-xl shadow-lg overflow-hidden w-full">
        <div className="md:flex w-full ">
          <div className="p-2 pt-8 md:w-1/2">
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

              <form onSubmit={handleSubmit} className="space-y-6 ">
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
                    className="flex items-center gap-2 text-red-600 text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{createChannelError?.message || formErrors.submit}</span>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isCreatingChannel}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isCreatingChannel ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <>
                      Create Channel
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>

          <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-base-100 to-base-200 p-8">
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
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}