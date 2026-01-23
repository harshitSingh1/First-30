import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import InteractiveMap from '@/components/map/InteractiveMap';
import NearbyServiceCard from '@/components/map/NearbyServiceCard';
import VoiceAssistantButton from '@/components/voice/VoiceAssistantButton';
import { mockNearbyServices } from '@/data/emergencyFlows';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Pill, Shield, Flame, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const filterTabs = [
  { value: '', label: 'All', icon: MapPin },
  { value: 'hospital', label: 'Hospitals', icon: Building2 },
  { value: 'pharmacy', label: 'Pharmacy', icon: Pill },
  { value: 'police', label: 'Police', icon: Shield },
  { value: 'fire', label: 'Fire', icon: Flame },
];

const MapNearbyHelp = () => {
  const [selectedType, setSelectedType] = useState<string>('');

  const filteredServices = selectedType 
    ? mockNearbyServices.filter(s => s.type === selectedType)
    : mockNearbyServices;

  return (
    <Layout showEmergencyBanner>
      <div className="container mx-auto px-4 py-6 pb-32">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-heading-1 text-foreground mb-2">Nearby Help</h1>
          <p className="text-muted-foreground">Find emergency services and medical facilities near you</p>
        </div>

        {/* Filter tabs */}
        <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-secondary/50">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className={cn(
                    'flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2.5 px-3',
                    'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Interactive Map */}
        <div className="mb-6">
          <InteractiveMap services={mockNearbyServices} selectedType={selectedType || undefined} />
        </div>

        {/* Services list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {selectedType ? filterTabs.find(t => t.value === selectedType)?.label : 'All Services'}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredServices.length} found
            </span>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredServices.map((service) => (
              <NearbyServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>

      {/* Voice Assistant Floating Button */}
      <VoiceAssistantButton />
    </Layout>
  );
};

export default MapNearbyHelp;
