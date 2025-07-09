# Admin Components

This directory contains admin-specific components that are separate from the shared user components. These components provide administrative functionality and are designed specifically for admin users.

## Components

### AdminDataTable

- **Purpose**: Displays user management data with admin-specific actions
- **Features**:
  - User role management
  - Status tracking (active, inactive, pending)
  - Task assignment statistics
  - Administrative actions (edit, deactivate, manage permissions)
  - Search and filtering capabilities

### AdminHeader

- **Purpose**: Admin-specific header with system status indicators
- **Features**:
  - Admin branding with shield icon
  - System status badges (online/offline, alerts)
  - Administrative navigation context

### AdminSectionCards

- **Purpose**: Displays administrative statistics and metrics
- **Features**:
  - User management statistics
  - System health monitoring
  - Task management overview
  - Pending administrative actions
  - Storage and uptime metrics

### AdminSidebar

- **Purpose**: Admin-specific navigation sidebar
- **Features**:
  - Administrative navigation items
  - System management tools
  - Security and access controls
  - Reports and analytics
  - Admin-specific branding

### AdminTaskCharts

- **Purpose**: Administrative analytics and charts
- **Features**:
  - User activity trends
  - System performance monitoring
  - Task status distribution
  - Administrative metrics visualization

## Usage

All admin components can be imported from the admin directory:

```tsx
import {
  AdminDataTable,
  AdminHeader,
  AdminSectionCards,
  AdminSidebar,
  AdminTaskCharts,
} from "@/components/admin";
```

## Design Principles

1. **Separation of Concerns**: Admin components are completely separate from user components
2. **Administrative Focus**: All components are designed with admin functionality in mind
3. **System Management**: Components focus on system-wide management rather than individual user tasks
4. **Security Awareness**: Components include security and access control indicators
5. **Performance Monitoring**: Built-in system health and performance tracking

## Styling

Admin components use a distinct color scheme to differentiate from user components:

- Primary admin color: Red (#dc2626) for admin branding
- Status colors: Green for active/online, Red for inactive/alerts, Orange for warnings
- Consistent with the overall design system while maintaining admin identity
