import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import InteractiveMapReal from '@/components/map/InteractiveMapReal';
import NearbyServiceCard from '@/components/map/NearbyServiceCard';
import VoiceAssistantButton from '@/components/voice/VoiceAssistantButton';
import { useNearbyServices } from '@/hooks/useNearbyServices';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Building2, Pill, Shield, Flame, MapPin, Loader2, AlertCircle, RefreshCw, Navigation } from 'lucide-react';
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
  const { t } = useLanguage();
  const { 
    services, 
    userLocation, 
    isLoading, 
    error, 
    permissionState,
    requestLocation,
    refresh,
    useFallback,
  } = useNearbyServices();

  const filteredServices = selectedType 
    ? services.filter(s => s.type === selectedType)
    : services;

  return (
    <Layout showEmergencyBanner>
      <div className="container mx-auto px-4 py-6 pb-32">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-heading-1 text-foreground mb-2">{t('citizen.nearby')}</h1>
          <p className="text-muted-foreground text-lg">{t('citizen.nearby.desc')}</p>
        </div>

        {/* Location Permission State */}
        {permissionState === 'prompt' && !userLocation && (
          <div className="premium-card p-6 mb-6 text-center">
            <Navigation className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Enable Location</h3>
            <p className="text-muted-foreground mb-4">
              Allow location access to find emergency services near you.
            </p>
            <Button onClick={requestLocation} disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Getting location...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  Enable Location
                </>
              )}
            </Button>
          </div>
        )}

        {permissionState === 'denied' && (
          <div className="premium-card p-6 mb-6 text-center border-amber-500/30 bg-amber-500/5">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Location Access Denied</h3>
            <p className="text-muted-foreground mb-4">
              Please enable location in your browser settings to see nearby services. Showing sample data instead.
            </p>
          </div>
        )}

        {error && permissionState !== 'denied' && (
          <div className="premium-card p-4 mb-6 flex items-center gap-3 border-amber-500/30 bg-amber-500/5">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-foreground">{error}</p>
          </div>
        )}

        {useFallback && userLocation && (
          <div className="flex items-center justify-between p-3 mb-4 rounded-lg bg-secondary/50">
            <span className="text-sm text-muted-foreground">
              Showing sample data. Real-time data may be unavailable.
            </span>
            <Button variant="ghost" size="sm" onClick={refresh} className="gap-1">
              <RefreshCw className="w-3 h-3" />
              Retry
            </Button>
          </div>
        )}

        {/* Filter tabs */}
        <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1.5 bg-secondary/50 rounded-xl">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className={cn(
                    'flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-3 rounded-lg',
                    'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-medium">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Interactive Map */}
        <div className="mb-8">
          <InteractiveMapReal 
            services={services} 
            selectedType={selectedType || undefined}
            userLocation={userLocation}
            isLoading={isLoading}
          />
        </div>

        {/* Services list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {selectedType ? filterTabs.find(t => t.value === selectedType)?.label : 'All Services'}
            </h2>
            <div className="flex items-center gap-2">
              {userLocation && (
                <Button variant="ghost" size="sm" onClick={refresh} disabled={isLoading}>
                  <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
                </Button>
              )}
              <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-secondary/50">
                {filteredServices.length} found
              </span>
            </div>
          </div>
          
          {isLoading && services.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredServices.map((service) => (
                <NearbyServiceCard 
                  key={service.id} 
                  service={service}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Voice Assistant Floating Button */}
      <VoiceAssistantButton />
    </Layout>
  );
};

export default MapNearbyHelp;
