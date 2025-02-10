import { auth } from "#/lib/auth";
import { headers } from "next/headers";
import React from "react";

const ProfilePage = async () => {
  const user = await getUserData();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen flex-col justify-center bg-neutral-100 py-6 dark:bg-neutral-900 sm:py-12">
      <div className="relative py-3 sm:mx-auto sm:max-w-xl">
        <div className="to-light-blue-500 absolute inset-0 -skew-y-6 transform bg-gradient-to-r from-blue-400 shadow-lg sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl"></div>
        <div className="relative bg-white px-4 py-10 shadow-lg dark:bg-neutral-800 sm:rounded-3xl sm:p-20">
          <div className="mx-auto max-w-md">
            <div className="flex items-center space-x-5">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 font-mono text-2xl text-blue-600">
                {user.user.name?.charAt(0) ?? "U"}
              </div>
              <div className="block self-start pl-2 text-xl font-semibold text-neutral-700 dark:text-neutral-200">
                <h2 className="leading-relaxed">{user.user.name}</h2>
                <p className="text-sm font-normal leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {user.user.email}
                </p>
              </div>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              <div className="space-y-4 py-8 text-base leading-6 text-neutral-700 dark:text-neutral-300 sm:text-lg sm:leading-7">
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Email Verified
                  </span>
                  <span className="font-semibold">
                    {user.user.emailVerified ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Created At
                  </span>
                  <span className="font-semibold">
                    {new Date(user.user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Updated At
                  </span>
                  <span className="font-semibold">
                    {new Date(user.user.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Phone Number
                  </span>
                  <span className="font-semibold">
                    {user.user.phoneNumber ?? "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Phone Verified
                  </span>
                  <span className="font-semibold">
                    {user.user.phoneNumberVerified ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              <div className="pt-6 text-base font-bold leading-6 sm:text-lg sm:leading-7">
                <p className="text-neutral-500 dark:text-neutral-400">
                  Session Information
                </p>
                <div className="mt-2 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                  <div className="flex justify-between">
                    <span>Expires At</span>
                    <span>
                      {new Date(user.session.expiresAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>IP Address</span>
                    <span>{user.session.ipAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Agent</span>
                    <span
                      className="max-w-[200px] truncate"
                      title={user.session.userAgent ?? "Browser"}
                    >
                      {user.session.userAgent}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

async function getUserData() {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  return user;
}

export default ProfilePage;
