import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentStatistics from './financials/PaymentStatistics';
import CollectorsSummary from './financials/CollectorsSummary';
import AllPaymentsTable from './financials/AllPaymentsTable';
import CollectorsList from './CollectorsList';
import { Card } from "@/components/ui/card";

const CollectorFinancialsView = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-medium mb-2 text-white">Financial & Collector Management</h1>
        <p className="text-dashboard-text">Manage payments and collector assignments</p>
      </header>

      <Card className="bg-dashboard-card border-dashboard-accent1/20">
        <Tabs defaultValue="overview" className="p-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 gap-4 bg-dashboard-dark">
            <TabsTrigger value="overview">Payment Overview</TabsTrigger>
            <TabsTrigger value="collectors">Collector Management</TabsTrigger>
            <TabsTrigger value="approvals">Payment Approvals</TabsTrigger>
            <TabsTrigger value="summaries">Collector Summaries</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <PaymentStatistics />
          </TabsContent>

          <TabsContent value="collectors" className="mt-6">
            <CollectorsList />
          </TabsContent>

          <TabsContent value="approvals" className="mt-6">
            <AllPaymentsTable />
          </TabsContent>

          <TabsContent value="summaries" className="mt-6">
            <CollectorsSummary />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <AllPaymentsTable />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default CollectorFinancialsView;