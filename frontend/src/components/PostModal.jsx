import { useState } from 'react';

const PostModal = ({ title, onClose, onSubmit, isUploading }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedImage) {
      alert('Please select an image');
      return;
    }
    onSubmit(selectedImage);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-lg">
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">{title}</h3>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {title === 'Update Post' ? 'Select New Image' : 'Select Image'}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">Maximum file size: 5MB</p>
        </div>

        {imagePreview && (
          <div className="mb-3 sm:mb-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 sm:h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition disabled:opacity-50 cursor-pointer text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUploading || !selectedImage}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
          >
            {isUploading ? (title === 'Update Post' ? 'Updating...' : 'Uploading...') : (title === 'Update Post' ? 'Update Post' : 'Create Post')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
