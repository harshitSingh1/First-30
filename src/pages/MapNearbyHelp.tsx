import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import MapPanel from '@/components/map/MapPanel';
import { mockNearbyServices } from '@/data/emergencyFlows';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const MapNearbyHelp = () => {
  const [selectedType, setSelectedType] = useState<string>('');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pb-24">
        <h1 className="text-heading-1 text-foreground mb-4">Nearby Help</h1>
        <p className="text-muted-foreground mb-6">Find emergency services near you</p>

        <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="">All</TabsTrigger>
            <TabsTrigger value="hospital">Hospitals</TabsTrigger>
            <TabsTrigger value="pharmacy">Pharmacy</TabsTrigger>
            <TabsTrigger value="police">Police</TabsTrigger>
            <TabsTrigger value="fire">Fire</TabsTrigger>
          </TabsList>
          <MapPanel services={mockNearbyServices} selectedType={selectedType || undefined} />
        </Tabs>
      </div>
    </Layout>
  );
};

export default MapNearbyHelp;
