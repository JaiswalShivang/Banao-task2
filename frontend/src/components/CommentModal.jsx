import { useState } from 'react';

const CommentModal = ({ onClose, onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-lg">
        <h3 className="text-lg font-bold mb-4">Add Comment</h3>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none"
          rows="4"
          placeholder="Write your comment..."
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition cursor-pointer text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer text-sm sm:text-base"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
