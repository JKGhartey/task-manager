# Teams and Projects Management

This document describes the new teams and projects functionality added to the task management system.

## Overview

The system now supports:

- **Teams**: Groups of users that can work together on tasks
- **Projects**: Collections of tasks that can be assigned to teams
- **Task Assignment**: Tasks can be assigned to specific projects

## Features

### Team Management

- Create, edit, and delete teams
- Assign users to teams
- Remove users from teams
- View team members and details

### Project Management

- Create, edit, and delete projects
- Assign projects to teams
- Assign tasks to projects
- Remove tasks from projects
- View project details and associated tasks

### Task Integration

- Tasks can be assigned to specific projects
- Project information is displayed in task details
- Task creation and editing includes project selection

## API Endpoints

### Teams

- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/assign-user` - Assign user to team
- `POST /api/teams/:id/remove-user` - Remove user from team

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/assign-task` - Assign task to project
- `POST /api/projects/:id/remove-task` - Remove task from project

## Frontend Components

### Admin Pages

- `ManageTeams.tsx` - Team management interface
- `ManageProjects.tsx` - Project management interface

### Services

- `teamService.ts` - API calls for team operations
- `projectService.ts` - API calls for project operations

### Navigation

- Added "Manage Teams" and "Manage Projects" to admin sidebar
- Updated routes configuration
- Added statistics cards to admin dashboard

## Usage

### Creating a Team

1. Navigate to Admin → Manage Teams
2. Click "Create Team"
3. Enter team name and description
4. Save the team

### Assigning Users to Teams

1. Go to Manage Teams
2. Click the user assignment button on a team
3. Select a user from the dropdown
4. Confirm assignment

### Creating a Project

1. Navigate to Admin → Manage Projects
2. Click "Create Project"
3. Enter project name and description
4. Optionally assign to a team
5. Save the project

### Assigning Tasks to Projects

1. Go to Manage Projects
2. Click the task assignment button on a project
3. Select a task from the dropdown
4. Confirm assignment

### Creating Tasks with Projects

1. Go to Create Task or Edit Task
2. Select a project from the project dropdown
3. Complete other task details
4. Save the task

## Access Control

- Only admin and manager roles can access team and project management
- All team and project operations require appropriate permissions
- Users can view teams and projects they are assigned to

## Database Schema

### Team Model

```typescript
{
  name: string;
  description?: string;
  members: User[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Project Model

```typescript
{
  name: string;
  description?: string;
  tasks: Task[];
  team?: Team;
  createdAt: Date;
  updatedAt: Date;
}
```

### Updated User Model

```typescript
{
  // ... existing fields
  teams: Team[];
}
```

### Updated Task Model

```typescript
{
  // ... existing fields
  project?: Project;
}
```

## Future Enhancements

- Team and project analytics
- Team performance metrics
- Project timeline tracking
- Advanced team permissions
- Project templates
- Team and project notifications
