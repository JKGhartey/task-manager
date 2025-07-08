import { ROUTES } from "../../routes/routes";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Welcome to the admin dashboard. Here you can manage tasks and users.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">Total Tasks</h3>
            <p className="text-3xl font-bold text-blue-600">24</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900">Completed</h3>
            <p className="text-3xl font-bold text-green-600">18</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900">
              In Progress
            </h3>
            <p className="text-3xl font-bold text-yellow-600">4</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-900">Pending</h3>
            <p className="text-3xl font-bold text-red-600">2</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href={ROUTES.ADMIN.CREATE_TASK}
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Create New Task</h3>
            <p className="text-sm text-gray-600">
              Add a new task to the system
            </p>
          </a>
          <a
            href={ROUTES.ADMIN.MANAGE_TASKS}
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Manage Tasks</h3>
            <p className="text-sm text-gray-600">View and edit all tasks</p>
          </a>
          <a
            href={ROUTES.ADMIN.MANAGE_USERS}
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-600">
              View and manage user accounts
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
