import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

const SkeletonStatCard: React.FC = () => (
  <Card className="bg-card">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-4 w-32 skeleton mb-2" />
          <Skeleton className="h-8 w-24 skeleton" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full skeleton" />
      </div>
    </CardContent>
  </Card>
);

export default SkeletonStatCard;
