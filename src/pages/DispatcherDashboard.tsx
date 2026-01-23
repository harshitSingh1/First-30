import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import DispatcherPanel from '@/components/dispatcher/DispatcherPanel';
import CaseCard from '@/components/dispatcher/CaseCard';
import PriorityBadge from '@/components/dispatcher/PriorityBadge';
import { mockDispatcherCases } from '@/data/emergencyFlows';
import { DispatcherCase } from '@/types/emergency';
import { CheckCircle2, MessageCircle } from 'lucide-react';

const DispatcherDashboard = () => {
  const [selectedCase, setSelectedCase] = useState<DispatcherCase | null>(mockDispatcherCases[0]);

  return (
    <Layout showEmergencyBanner={false} showFooter={false}>
      <div className="h-[calc(100vh-4rem)] p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          {/* Cases List */}
          <DispatcherPanel title="Active Cases">
            <div className="space-y-3">
              {mockDispatcherCases.map((c) => (
                <CaseCard key={c.id} caseData={c} isSelected={selectedCase?.id === c.id} onClick={() => setSelectedCase(c)} />
              ))}
            </div>
          </DispatcherPanel>

          {/* Case Details */}
          <DispatcherPanel title="Case Details">
            {selectedCase ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-foreground">{selectedCase.category}</h3>
                  <PriorityBadge priority={selectedCase.priority} />
                </div>
                <p className="text-sm text-muted-foreground">{selectedCase.summary}</p>
                <div className="text-xs text-muted-foreground">📍 {selectedCase.location}</div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Steps Completed:</h4>
                  {selectedCase.stepsCompleted.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-success mb-1">
                      <CheckCircle2 className="w-4 h-4" /> {step}
                    </div>
                  ))}
                </div>
              </div>
            ) : <p className="text-muted-foreground">Select a case</p>}
          </DispatcherPanel>

          {/* Recommended Actions */}
          <DispatcherPanel title="Recommendations">
            {selectedCase ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Suggested Actions:</h4>
                  {selectedCase.suggestedActions.map((action, i) => (
                    <div key={i} className="text-sm text-muted-foreground mb-1">• {action}</div>
                  ))}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Questions to Ask:
                  </h4>
                  {selectedCase.suggestedQuestions.map((q, i) => (
                    <div key={i} className="text-sm text-muted-foreground mb-1">• {q}</div>
                  ))}
                </div>
              </div>
            ) : null}
          </DispatcherPanel>
        </div>
      </div>
    </Layout>
  );
};

export default DispatcherDashboard;
