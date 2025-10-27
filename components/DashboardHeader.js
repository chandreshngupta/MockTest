function DashboardHeader({ user }) {
  try {
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [notifOpen, setNotifOpen] = React.useState(false);
    const [notifications, setNotifications] = React.useState([
      { id: 1, title: 'New Test Released', time: '2h ago' },
      { id: 2, title: 'Your weekly report is ready', time: '1d ago' }
    ]);

    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
                <div className="icon-graduation-cap text-xl text-white"></div>
              </div>
              <span className="text-2xl font-bold text-[var(--primary-color)]">ExamPro</span>
            </div>

            <div className="flex items-center gap-6">
              <button onClick={() => window.location.href = 'dashboard.html'} className="text-gray-600 hover:text-[var(--primary-color)]">
                Dashboard
              </button>
              <button onClick={() => window.location.href = 'results.html'} className="text-gray-600 hover:text-[var(--primary-color)]">
                Results
              </button>
              <button onClick={() => window.location.href = 'admin.html'} className="text-gray-600 hover:text-[var(--primary-color)]">
                Admin
              </button>
              <div className="relative">
                <button onClick={() => setNotifOpen(!notifOpen)} className="relative mr-3">
                  <div className="icon-bell text-xl text-gray-600"></div>
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">{notifications.length}</span>
                </button>
                {notifOpen && (
                  <div className="absolute right-12 mt-2 w-64 bg-white rounded-lg shadow-lg py-2">
                    <div className="px-4 py-2 text-sm font-semibold">Notifications</div>
                    <div className="max-h-48 overflow-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="px-4 py-3 border-t last:border-b hover:bg-gray-50">
                          <div className="text-sm text-gray-800">{n.title}</div>
                          <div className="text-xs text-gray-400">{n.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 hover:opacity-80">
                  <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="text-lg text-gray-700">{user?.name ? user.name.split(' ').map(n => n[0]).slice(0,2).join('') : 'U'}</div>
                  </div>
                  <span className="text-gray-700">{user?.name}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    <button onClick={() => window.location.href = 'profile.html'} className="w-full px-4 py-2 text-left hover:bg-gray-50">Profile</button>
                    <button onClick={logoutUser} className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600">Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('DashboardHeader error:', error);
    return null;
  }
}