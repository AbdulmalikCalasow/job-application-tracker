# Job Application Tracker

A full-stack job application tracker built for the CSI 246 Web Development IV midterm project at Renton Technical College.

Users can create, view, update, and delete job application records, filter applications by status, and view application counts on a dashboard.

## Technology Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- MongoDB with Mongoose
- Tailwind CSS
- ESLint

## Implemented Features

- Create applications with company, position, status, date applied, and notes.
- View all applications and open individual application details.
- Edit application information and status.
- Delete applications with an explicit confirmation step.
- Cancel deletion without changing the saved record.
- Filter applications by Applied, Interview, Offer, or Rejected.
- View total applications and counts for each status on the dashboard.
- Click dashboard cards to open the corresponding filtered list.
- Navigate between pages using shared navigation.
- Display form validation errors and pending submission feedback.
- Display loading screens, an error screen with a retry button, and a custom application-not-found page.
- Store application records in MongoDB.

## Application Routes

| Route | Purpose |
| --- | --- |
| `/` | Dashboard with total and per-status counts |
| `/applications` | Application list and status filter |
| `/applications?status=Interview` | Example of a preselected status filter |
| `/applications/new` | Create an application |
| `/applications/[id]` | View an application's details |
| `/applications/[id]/edit` | Edit an application |

The application name in the shared navigation links back to the home dashboard.

## Data Model

Each application contains:

| Field | Description |
| --- | --- |
| `id` | Database-generated identifier |
| `company` | Required company name |
| `position` | Required position title |
| `status` | Applied, Interview, Offer, or Rejected |
| `dateApplied` | Application date; future dates are not allowed |
| `notes` | Optional notes |

## Architecture

The project uses the Next.js App Router.

### Server-Side Data Handling

- Pages retrieve application data through functions in `app/lib/data.ts`.
- Server Actions in `app/lib/actions.ts` handle creation, editing, and deletion.
- Database connection logic and the Mongoose model remain in `app/lib`.
- Application data is validated on the server before creation and updates.
- Successful database changes trigger revalidation of affected routes.

### Client-Side Interaction

Client Components handle:

- Application status filtering.
- Form feedback and pending submission states.
- Deletion confirmation and cancellation.

The applications page fetches records on the server and passes them to the interactive list component. Dashboard links provide an initial status filter through the URL.

### Shared Interface

- Shared navigation is defined in `app/layout.tsx`.
- Reusable interface components are organized in `app/ui/components`.
- Route-specific files provide loading, error, and not-found screens.

## Project Organization

```text
app/
  layout.tsx
  page.tsx
  applications/
    page.tsx
    loading.tsx
    error.tsx
    new/
    [id]/
      page.tsx
      loading.tsx
      not-found.tsx
      edit/
  lib/
    actions.ts
    data.ts
    db.ts
    definitions.ts
    models.ts
    utils.ts
    validation.ts
  ui/
    components/
```

## Prerequisites

- Node.js and npm compatible with the project's Next.js version.
- A running local MongoDB instance or an accessible MongoDB Atlas database.
- Git to clone the repository.

## Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/AbdulmalikCalasow/job-application-tracker.git
cd job-application-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure MongoDB

Create a file named `.env.local` in the project root.

The database connection code reads the `MONGODB_URI` environment variable.

For local MongoDB, add:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/job_application_tracker
```

The local URI above is an example configuration. MongoDB is not bundled with the repository and must be running separately.

If using MongoDB Atlas, set `MONGODB_URI` to your own Atlas connection string instead.

Keep `.env.local` private. Never commit connection strings containing credentials.

### 4. Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

If that port is unavailable, use the address printed in the terminal.

### 5. Add an Application

Use Add application in the navigation to create your first record.

New records are stored in the MongoDB database configured through `MONGODB_URI`.

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Start the production server after building |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Check TypeScript without generating output files |

To run in production mode:

```bash
npm run build
npm start
```

Ensure the database connection is configured and MongoDB is accessible.

## Validation and Error Handling

- Company and position are required.
- Status must be one of the supported values.
- The application date cannot be in the future.
- Server-side validation runs before application data is saved.
- Invalid application IDs are checked before database lookups.
- Missing applications display a custom not-found screen.
- Failed submissions return user-facing messages.
- Unexpected application-page errors display an error screen with a Try again button.
- Pending submissions disable the corresponding action button.
- Deletion requires confirmation before the server action is submitted.

## Manual Verification Completed

The following behavior was checked during development:

- Application deletion requires confirmation.
- Canceling deletion leaves the application unchanged.
- Confirmed deletion returns to the applications list.
- Deleted records remain absent after refreshing.
- Dashboard navigation links open the intended pages.
- Dashboard status cards select the matching application filter.
- Manual status filtering continues to work.
- Invalid application IDs display the custom not-found screen.
- A deliberately triggered page error displays the error screen.
- Shared navigation remains available on the error screen.
- Navigation back to the normal applications list works after the test error.
- Removing the temporary error trigger restores normal page behavior.
- TypeScript checks passed during development.

The temporary error-triggering code used for testing was removed.

Displaying the retry button was verified; recovery from an actual database outage was not separately tested.

## Final Verification

The following checks were completed before submission:

- `npm run build` completed successfully, including TypeScript checking.
- `npm run lint` completed with 0 errors and 2 unused-parameter warnings in `app/lib/actions.ts`.
- `git ls-files -- ".env*"` returned no output, confirming no matching environment files were currently tracked.

The production build reported a warning about an unrelated `package-lock.json` outside the repository. Next.js ignored that file and completed the build successfully.

## Planned / In Progress

The following proposal items are not implemented in this submission:

- A dedicated `/stats` page showing applications per status and per week.
- Follow-up flags for applications with no reply after seven days.
- Reusable colored status badges.
- Additional appearance and application-grouping refinements.

The home dashboard already displays application counts by status. Weekly statistics remain planned.

## Credential Handling

The `.gitignore` file includes `.env*` to exclude local environment files.

Do not commit:

- `.env.local` or other files containing secrets.
- MongoDB usernames or passwords.
- Database connection strings containing credentials.

Each person running the project should create their own `.env.local` file.

## Author

Abdulmalik Calasow  
CSI 246 — Web Development IV  
Renton Technical College