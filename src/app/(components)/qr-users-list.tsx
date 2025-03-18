"use client"

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface QrUsersListProps {
  qrId: string;
  onUserClick: (user: any) => void;
  id?: string;
}

export function QrUsersList({ qrId, onUserClick, id }: QrUsersListProps) {
  // Mock data for top users of a specific QR
  const generateTopUsers = () => {
    // Generate data based on the QR ID to ensure consistency
    const seed = qrId.charCodeAt(qrId.length - 1);

    // Base users
    const baseUsers = [
      {
        id: 1,
        name: "Carlos Méndez",
        email: "carlos@example.com",
        avatar: "https://github.com/yusufhilmi.png",
        orders: 12,
        spent: "$345.75",
      },
      {
        id: 2,
        name: "Ana Rodríguez",
        email: "ana@example.com",
        avatar: "https://github.com/furkanksl.png",
        orders: 8,
        spent: "$215.50",
      },
      {
        id: 3,
        name: "Miguel Sánchez",
        email: "miguel@example.com",
        avatar: "https://github.com/polymet-ai.png",
        orders: 7,
        spent: "$187.25",
      },
      {
        id: 4,
        name: "Laura Martínez",
        email: "laura@example.com",
        avatar: "https://github.com/furkanksl.png",
        orders: 5,
        spent: "$142.80",
      },
      {
        id: 5,
        name: "Pedro Gómez",
        email: "pedro@example.com",
        avatar: "https://github.com/yusufhilmi.png",
        orders: 4,
        spent: "$98.50",
      },
    ];

    // Modify orders and spent based on QR ID
    return baseUsers.map((user, index) => {
      const modifier = ((seed + index) % 5) + 1; // 1-5
      return {
        ...user,
        orders: user.orders + modifier,
        spent: `$${(parseFloat(user.spent.replace("$", "")) + modifier * 15).toFixed(2)}`,
      };
    });
  };

  const topUsers = generateTopUsers();
  const maxOrders = Math.max(...topUsers.map((user) => user.orders));

  return (
    <div
      className="h-full overflow-y-auto"
      id={id || "qr-users-list-container"}
    >
      <div className="space-y-4">
        {topUsers.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center space-x-4 p-3 rounded-lg border dark:border-gray-800 hover:bg-muted/50 dark:hover:bg-gray-800/50 cursor-pointer"
            onClick={() => onUserClick(user)}
            id={`top-user-${user.id}`}
          >
            <div
              className="font-medium w-6 text-center text-muted-foreground dark:text-gray-400"
              id={`top-user-rank-${user.id}`}
            >
              #{index + 1}
            </div>
            <Avatar className="h-10 w-10" id={`top-user-avatar-${user.id}`}>
              <AvatarImage
                src={user.avatar}
                alt={user.name}
                id={`top-user-avatar-img-${user.id}`}
              />

              <AvatarFallback id={`top-user-avatar-fallback-${user.id}`}>
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1" id={`top-user-info-${user.id}`}>
              <div
                className="flex justify-between items-start"
                id={`top-user-header-${user.id}`}
              >
                <div id={`top-user-details-${user.id}`}>
                  <p
                    className="font-medium dark:text-white"
                    id={`top-user-name-${user.id}`}
                  >
                    {user.name}
                  </p>
                  <p
                    className="text-xs text-muted-foreground dark:text-gray-400"
                    id={`top-user-email-${user.id}`}
                  >
                    {user.email}
                  </p>
                </div>
                <div className="text-right" id={`top-user-stats-${user.id}`}>
                  <p
                    className="font-medium dark:text-white"
                    id={`top-user-spent-${user.id}`}
                  >
                    {user.spent}
                  </p>
                  <p
                    className="text-xs text-muted-foreground dark:text-gray-400"
                    id={`top-user-orders-${user.id}`}
                  >
                    {user.orders} pedidos
                  </p>
                </div>
              </div>
              <div
                className="mt-2"
                id={`top-user-progress-container-${user.id}`}
              >
                <Progress
                  value={(user.orders / maxOrders) * 100}
                  className="h-2"
                  id={`top-user-progress-${user.id}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
