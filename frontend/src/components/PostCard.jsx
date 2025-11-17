import { useState } from 'react';

const PostCard = ({ post, user, onLike, onDelete, onEdit, onComment }) => {
  const [viewComments, setViewComments] = useState(false);

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
            {post.createdBy?.username?.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-xs sm:text-sm">{post.createdBy?.username}</span>
        </div>
        {post.createdBy?._id === user?.id && (
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onEdit(post._id)}
              className="text-gray-600 hover:text-blue-500 transition cursor-pointer p-1"
              title="Edit post"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(post._id)}
              className="text-gray-600 hover:text-red-500 transition cursor-pointer p-1"
              title="Delete post"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="w-full aspect-square bg-black flex items-center justify-center">
        <img
          src={post.image}
          alt="Post"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-3 sm:gap-4 mb-2">
          <button
            onClick={() => onLike(post._id)}
            className={`transition cursor-pointer ${
              post.likedBy?.includes(user?.id) ? 'text-red-500' : 'text-gray-900 hover:text-gray-500'
            }`}
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill={post.likedBy?.includes(user?.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={() => onComment(post._id)}
            className="text-gray-900 hover:text-gray-500 transition cursor-pointer"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>

        <div className="mb-1 sm:mb-2">
          <span className="font-semibold text-xs sm:text-sm">{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
        </div>

        {post.comments && post.comments.length > 0 && (
          <div className="space-y-1">
            {viewComments ? (
              <>
                <button
                  onClick={() => setViewComments(false)}
                  className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 mb-2 cursor-pointer"
                >
                  Hide comments
                </button>
                <div className="space-y-1.5 sm:space-y-2 max-h-60 sm:max-h-80 overflow-y-auto">
                  {post.comments.map((cmt, idx) => (
                    <div key={idx} className="flex gap-1.5 sm:gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {cmt.user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm">
                          <span className="font-semibold mr-1 sm:mr-2">{cmt.user?.username}</span>
                          <span className="text-gray-700">{cmt.text}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-1.5 sm:gap-2">
                  <p className="text-xs sm:text-sm">
                    <span className="font-semibold mr-1 sm:mr-2">{post.comments[0].user?.username}</span>
                    <span className="text-gray-700">{post.comments[0].text}</span>
                  </p>
                </div>
                {post.comments.length > 1 && (
                  <button
                    onClick={() => setViewComments(true)}
                    className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    View all {post.comments.length} comments
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
