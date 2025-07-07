"use client";
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  colorClass,
}) => (
  <Card className="bg-card">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`${colorClass} p-2 rounded-full`}>{icon}</div>
      </div>
    </CardContent>
  </Card>
);

export default StatCard;
