import DesignOrdersDashboard from "#/components/admin/orders-table";
import { db } from "#/server/db";
import { designJob } from "#/server/db/schema";
import type { DesignOrderType } from "#/types/jobs";
import React from "react";

const AdminHome = async () => {
  const data = (await db
    .select()
    .from(designJob)) as unknown as DesignOrderType[];

  return (
    <div>
      <DesignOrdersDashboard orders={data} />
    </div>
  );
};

export default AdminHome;
