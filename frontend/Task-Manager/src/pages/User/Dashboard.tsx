import { ROUTES } from "../../routes/routes";

const UserDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Welcome back! Here's an overview of your tasks and progress.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">My Tasks</h3>
            <p className="text-3xl font-bold text-blue-600">8</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900">Completed</h3>
            <p className="text-3xl font-bold text-green-600">5</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900">
              In Progress
            </h3>
            <p className="text-3xl font-bold text-yellow-600">3</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href={ROUTES.USER.MY_TASKS}
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">View My Tasks</h3>
            <p className="text-sm text-gray-600">See all your assigned tasks</p>
          </a>
          <div className="block p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-medium text-gray-900">Update Profile</h3>
            <p className="text-sm text-gray-600">Coming soon...</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              Task "Update documentation" completed
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              Task "Review code changes" started
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              New task "Fix bug in login" assigned
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
