"use client";

import { useState } from "react";
import {
  APPLICATION_STATUSES,
  type Application,
  type ApplicationStatus,
} from "../lib/definitions";

type ApplicationListProps = {
  applications: Application[];
};

export default function ApplicationList({
  applications,
}: ApplicationListProps) {
  const [selectedStatus, setSelectedStatus] = useState<
    ApplicationStatus | "All"
  >("All");

  const filteredApplications = applications.filter(
    (application) =>
      selectedStatus === "All" || application.status === selectedStatus
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="status-filter" className="font-medium">
          Filter by status:
        </label>

        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(event) =>
            setSelectedStatus(
              event.target.value as ApplicationStatus | "All"
            )
          }
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="All">All statuses</option>

          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Showing {filteredApplications.length} of {applications.length} applications
      </p>

      {applications.length === 0 ? (
        <p className="rounded-lg border border-zinc-300 p-6 dark:border-zinc-700">
          No applications yet.
        </p>
      ) : filteredApplications.length === 0 ? (
        <p className="rounded-lg border border-zinc-300 p-6 dark:border-zinc-700">
          No applications match this status.
        </p>
      ) : (
        <ul className="space-y-4">
          {filteredApplications.map((application) => (
            <li
              key={application.id}
              className="space-y-2 rounded-lg border border-zinc-300 p-6 shadow-md dark:border-zinc-700"
            >
              <h2 className="text-xl font-semibold">
                {application.position}
              </h2>

              <p>{application.company}</p>

              <p className="text-sm">
                Status: {application.status}
              </p>

              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Applied: {application.dateApplied}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}