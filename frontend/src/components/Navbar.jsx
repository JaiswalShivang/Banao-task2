import { useState } from 'react';

const Navbar = ({ user, showMyPosts, onTogglePosts, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-300 sticky top-0 z-40 p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">Banao Task-2</h1>
        <div className="flex items-center gap-2 sm:gap-4 relative">
          <div 
            className="relative"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <button className="text-gray-700 cursor-pointer flex items-center gap-1 sm:gap-2 hover:text-blue-500">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              {user?.username}
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    onTogglePosts();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700 cursor-pointer font-medium"
                >
                  {showMyPosts ? 'All Posts' : 'My Posts'}
                </button>
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-500 cursor-pointer font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
