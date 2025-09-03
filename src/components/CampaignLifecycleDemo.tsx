import React from 'react';
import CampaignLifecycleMap, { type CampaignStage, type Campaign } from './CampaignLifecycleMap';

// Sample campaign lifecycle stages
const sampleStages: CampaignStage[] = [
  // Campaign 1 stages
  {
    id: 'research-1',
    x: 150,
    y: 100,
    label: 'Research & Planning',
    description: 'Market analysis and strategy development',
    status: 'completed',
  },
  {
    id: 'design-1',
    x: 300,
    y: 120,
    label: 'Creative Design',
    description: 'Asset creation and brand alignment',
    status: 'completed',
  },
  {
    id: 'launch-1',
    x: 450,
    y: 100,
    label: 'Campaign Launch',
    description: 'Go-live and initial monitoring',
    status: 'active',
  },
  {
    id: 'optimize-1',
    x: 600,
    y: 80,
    label: 'Optimization',
    description: 'Performance tuning and A/B testing',
    status: 'planning',
  },
  {
    id: 'closure-1',
    x: 750,
    y: 100,
    label: 'Campaign Closure',
    description: 'Analysis and reporting',
    status: 'planning',
  },

  // Campaign 2 stages
  {
    id: 'research-2',
    x: 120,
    y: 250,
    label: 'Target Analysis',
    description: 'Audience segmentation and profiling',
    status: 'completed',
  },
  {
    id: 'content-2',
    x: 280,
    y: 280,
    label: 'Content Creation',
    description: 'Multi-channel content development',
    status: 'completed',
  },
  {
    id: 'testing-2',
    x: 420,
    y: 250,
    label: 'A/B Testing',
    description: 'Message and format testing',
    status: 'paused',
  },
  {
    id: 'rollout-2',
    x: 580,
    y: 230,
    label: 'Phased Rollout',
    description: 'Gradual campaign deployment',
    status: 'planning',
  },
  {
    id: 'measure-2',
    x: 720,
    y: 250,
    label: 'Performance Measurement',
    description: 'KPI tracking and analysis',
    status: 'planning',
  },

  // Campaign 3 stages
  {
    id: 'discovery-3',
    x: 180,
    y: 400,
    label: 'Discovery Phase',
    description: 'Requirement gathering and feasibility',
    status: 'completed',
  },
  {
    id: 'development-3',
    x: 350,
    y: 420,
    label: 'Asset Development',
    description: 'Campaign materials and automation setup',
    status: 'failed',
  },
  {
    id: 'review-3',
    x: 500,
    y: 400,
    label: 'Stakeholder Review',
    description: 'Approval and compliance check',
    status: 'planning',
  },
  {
    id: 'execution-3',
    x: 650,
    y: 380,
    label: 'Campaign Execution',
    description: 'Full deployment and monitoring',
    status: 'planning',
  },
  {
    id: 'analysis-3',
    x: 800,
    y: 400,
    label: 'Results Analysis',
    description: 'ROI calculation and learnings',
    status: 'planning',
  },

  // Campaign 4 stages
  {
    id: 'ideation-4',
    x: 140,
    y: 520,
    label: 'Concept Ideation',
    description: 'Brainstorming and concept validation',
    status: 'active',
  },
  {
    id: 'prototype-4',
    x: 290,
    y: 550,
    label: 'Prototype Creation',
    description: 'MVP development and testing',
    status: 'active',
  },
  {
    id: 'feedback-4',
    x: 440,
    y: 520,
    label: 'User Feedback',
    description: 'User testing and iteration',
    status: 'planning',
  },
  {
    id: 'scale-4',
    x: 590,
    y: 500,
    label: 'Scale Preparation',
    description: 'Infrastructure and process setup',
    status: 'planning',
  },
  {
    id: 'launch-4',
    x: 740,
    y: 520,
    label: 'Full Launch',
    description: 'Wide release and support',
    status: 'planning',
  },
];

// Sample campaigns
const sampleCampaigns: Campaign[] = [
  {
    id: 'campaign-1',
    name: 'Q4 Product Launch',
    color: 'hsl(var(--chart-1))',
    stages: ['research-1', 'design-1', 'launch-1', 'optimize-1', 'closure-1'],
    startY: 100,
  },
  {
    id: 'campaign-2',
    name: 'Brand Awareness Drive',
    color: 'hsl(var(--chart-2))',
    stages: ['research-2', 'content-2', 'testing-2', 'rollout-2', 'measure-2'],
    startY: 250,
  },
  {
    id: 'campaign-3',
    name: 'Customer Retention',
    color: 'hsl(var(--chart-3))',
    stages: ['discovery-3', 'development-3', 'review-3', 'execution-3', 'analysis-3'],
    startY: 400,
  },
  {
    id: 'campaign-4',
    name: 'Innovation Lab',
    color: 'hsl(var(--chart-4))',
    stages: ['ideation-4', 'prototype-4', 'feedback-4', 'scale-4', 'launch-4'],
    startY: 520,
  },
];

const CampaignLifecycleDemo: React.FC = () => {
  const handleStageSelect = (stageId: string, campaignId: string) => {
    console.log('Selected stage:', stageId, 'from campaign:', campaignId);
    // You could navigate to a detailed view or show a modal
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Campaign Lifecycle Management
          </h1>
          <p className="text-muted-foreground">
            Interactive visualization of campaign progression from planning to completion. 
            Each campaign starts from the left axis and flows through various stages.
          </p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4">
          <CampaignLifecycleMap
            width={1000}
            height={600}
            grid={true}
            stages={sampleStages}
            campaigns={sampleCampaigns}
            onSelectStage={handleStageSelect}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleCampaigns.map(campaign => (
            <div key={campaign.id} className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: campaign.color }}
                ></div>
                <h3 className="font-semibold text-foreground">{campaign.name}</h3>
              </div>
              <div className="space-y-1">
                {campaign.stages.map(stageId => {
                  const stage = sampleStages.find(s => s.id === stageId);
                  return stage ? (
                    <div key={stageId} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{stage.label}</span>
                      <span 
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: stage.status === 'completed' ? 'hsl(142 71% 45% / 0.2)' :
                                          stage.status === 'active' ? 'hsl(var(--chart-1) / 0.2)' :
                                          stage.status === 'paused' ? 'hsl(var(--medium) / 0.2)' :
                                          stage.status === 'failed' ? 'hsl(var(--critical) / 0.2)' :
                                          'hsl(var(--info) / 0.2)',
                          color: stage.status === 'completed' ? 'hsl(142 71% 45%)' :
                                stage.status === 'active' ? 'hsl(var(--chart-1))' :
                                stage.status === 'paused' ? 'hsl(var(--medium))' :
                                stage.status === 'failed' ? 'hsl(var(--critical))' :
                                'hsl(var(--info))'
                        }}
                      >
                        {stage.status}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignLifecycleDemo;