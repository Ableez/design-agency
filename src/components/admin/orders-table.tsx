"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "#/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table";
import { Button } from "#/components/ui/button";
import { Moon, Sun, Search, Clock } from "lucide-react";
import { formatDate } from "#/lib/utils";
import type { DesignOrderType } from "#/types/jobs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { Badge } from "#/components/ui/badge";
import { Skeleton } from "#/components/ui/skeleton";
import {
  IconBrandFacebookFilled,
  IconBrandInstagramFilled,
  IconBrandTiktokFilled,
} from "@tabler/icons-react";

// Helper function to calculate deadline and urgency
const calculateDeadlineInfo = (order: DesignOrderType) => {
  const orderDate = new Date(order.timestamp);
  const now = new Date();
  const hoursElapsed = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);

  const deadlineHours = order.deliverySpeed === "express" ? 24 : 72;
  const hoursRemaining = deadlineHours - hoursElapsed;

  // Calculate percentage of time elapsed
  const progressPercent = (hoursElapsed / deadlineHours) * 100;

  return {
    hoursRemaining,
    isOverdue: hoursRemaining < 0,
    progressPercent,
    deadline: new Date(orderDate.getTime() + deadlineHours * 60 * 60 * 1000),
    urgencyScore: calculateUrgencyScore(hoursRemaining, order.deliverySpeed),
  };
};

const calculateUrgencyScore = (
  hoursRemaining: number,
  deliverySpeed: string,
) => {
  const baseScore = hoursRemaining < 0 ? 1000 : 100 - hoursRemaining;
  const expressMultiplier = deliverySpeed === "express" ? 1.5 : 1;
  return baseScore * expressMultiplier;
};

export default function DesignOrdersDashboard({
  orders,
}: {
  orders: DesignOrderType[];
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DesignOrderType;
    direction: "asc" | "desc";
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (!isClient) setIsClient(true);
  }, [isClient]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.platform.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "complete"
          ? !!order.designFiles
          : !order.designFiles;

    const matchesPlatform =
      platformFilter === "all"
        ? true
        : order.platform.toLowerCase() === platformFilter;

    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (a.designFiles && !b.designFiles) return 1;
    if (!a.designFiles && b.designFiles) return -1;
    if (a.designFiles && b.designFiles) return 0;

    const aInfo = calculateDeadlineInfo(a);
    const bInfo = calculateDeadlineInfo(b);
    return bInfo.urgencyScore - aInfo.urgencyScore;
  });

  const getUrgencyBadge = (order: DesignOrderType) => {
    if (order.designFiles) return null;

    const { hoursRemaining, isOverdue } = calculateDeadlineInfo(order);

    if (isOverdue) {
      return (
        <Badge variant="destructive" className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          Overdue
        </Badge>
      );
    }

    if (hoursRemaining < 4) {
      return (
        <Badge variant="destructive" className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          Critical
        </Badge>
      );
    }

    if (hoursRemaining < 12) {
      return (
        <Badge variant="outline" className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          Urgent
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="flex items-center gap-2">
        <Clock className="h-3 w-3" />
        {Math.ceil(hoursRemaining)}h left
      </Badge>
    );
  };

  const getStatusBadge = (order: DesignOrderType) => {
    return order.designFiles ? (
      <Badge variant="default" className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Complete
      </Badge>
    ) : (
      <Badge variant="outline" className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-yellow-500" />
        Pending
      </Badge>
    );
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Design Orders Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-lg"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div className="relative">
            <Search className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="complete">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">
                <div className="flex place-items-center justify-start gap-2 align-middle">
                  <IconBrandInstagramFilled width={20} />
                  Instagram
                </div>
              </SelectItem>
              <SelectItem value="tiktok">
                <div className="flex place-items-center justify-start gap-2 align-middle">
                  <IconBrandTiktokFilled width={20} />
                  TikTok
                </div>
              </SelectItem>
              <SelectItem value="facebook">
                <div className="flex place-items-center justify-start gap-2 align-middle">
                  <IconBrandFacebookFilled width={20} />
                  Facebook
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border p-4 shadow-sm dark:border-neutral-700">
          <Table className="relative">
            <TableHeader className="bg-background sticky top-0">
              <TableRow>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[120px]">Deadline</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Delivery Speed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                sortedOrders.map((order) => {
                  const deadlineInfo = calculateDeadlineInfo(order);
                  return (
                    <TableRow
                      key={order.id}
                      className={`hover:bg-accent/50 ${
                        !order.designFiles && deadlineInfo.hoursRemaining < 4
                          ? "bg-red-50 dark:bg-red-900/10"
                          : ""
                      }`}
                    >
                      <TableCell>{getStatusBadge(order)}</TableCell>
                      <TableCell>{getUrgencyBadge(order)}</TableCell>
                      <TableCell>
                        {isClient ? (
                          formatDate(order.timestamp)
                        ) : (
                          <Skeleton className="h-4 w-24" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{order.username}</span>
                          <span className="text-muted-foreground text-sm">
                            {order.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{order.service}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.platform}</Badge>
                      </TableCell>
                      <TableCell>{order.size}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{order.deliverySpeed}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
