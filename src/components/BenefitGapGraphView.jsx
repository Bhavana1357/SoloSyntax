import React, { useState } from 'react';
import { 
  Info, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Layers, 
  Sparkles,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';

export function BenefitGapGraphView({ graphData, onSimulateFix, citizen }) {
  const { nodes, links } = graphData;
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'BLOCKING' | 'SCHEMES'

  // Categorize nodes into columns
  const factNodes = nodes.filter(n => n.type === 'fact');
  const prereqNodes = nodes.filter(n => n.type === 'prerequisite');
  const evidenceNodes = nodes.filter(n => n.type === 'evidence');
  const schemeNodes = nodes.filter(n => n.type === 'scheme');

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // Find linked node IDs for highlight
  const connectedNodeIds = new Set();
  if (selectedNodeId) {
    connectedNodeIds.add(selectedNodeId);
    links.forEach(l => {
      if (l.source === selectedNodeId) connectedNodeIds.add(l.target);
      if (l.target === selectedNodeId) connectedNodeIds.add(l.source);
    });
  }

  return (
    <div className="gap-graph-container">
      {/* Graph Toolbar */}
      <div className="graph-toolbar">
        <div className="graph-title-group">
          <div className="graph-eyebrow">
            <Layers size={14} />
            <span>Benefit Gap Graph · Dependency Engine</span>
          </div>
          <h3 className="graph-title">Visual Eligibility & Dependency Architecture</h3>
          <p className="graph-desc">
            Traces the real dependency chain: Citizen Facts → Systemic Prerequisites → Evidence Proofs → Unlocked Schemes. Click any node to inspect resolution instructions.
          </p>
        </div>

        <div className="graph-legend">
          <div className="legend-item">
            <span className="dot dot-fact"></span>
            <span>Citizen Fact</span>
          </div>
          <div className="legend-item">
            <span className="dot dot-blocking"></span>
            <span>Prerequisite Blocker</span>
          </div>
          <div className="legend-item">
            <span className="dot dot-missing"></span>
            <span>Evidence Gap</span>
          </div>
          <div className="legend-item">
            <span className="dot dot-scheme"></span>
            <span>Scheme Opportunity</span>
          </div>
          <div className="legend-item">
            <span className="dot dot-satisfied"></span>
            <span>Satisfied / Ready</span>
          </div>
        </div>
      </div>

      {/* Main 4-Column Graph Canvas */}
      <div className="graph-columns-canvas">
        {/* Column 1: Citizen Facts */}
        <div className="graph-column col-facts">
          <div className="column-header">
            <span className="col-num">1</span>
            <div className="col-header-text">
              <h4>Citizen Facts</h4>
              <span>Provided Circumstances</span>
            </div>
          </div>
          <div className="column-nodes">
            {factNodes.map(node => {
              const isSelected = selectedNodeId === node.id;
              const isHighlighted = connectedNodeIds.has(node.id);
              return (
                <div 
                  key={node.id}
                  className={`graph-node fact-node ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                  onClick={() => setSelectedNodeId(node.id)}
                >
                  <div className="node-badge-fact">FACT</div>
                  <div className="node-label">{node.label}</div>
                  <div className="node-sub">{node.sub}</div>
                  <div className="node-status-chip satisfied">
                    <CheckCircle2 size={11} /> Verified
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Prerequisite Gaps */}
        <div className="graph-column col-prereqs">
          <div className="column-header">
            <span className="col-num">2</span>
            <div className="col-header-text">
              <h4>Prerequisites</h4>
              <span>Systemic Dependencies</span>
            </div>
          </div>
          <div className="column-nodes">
            {prereqNodes.length === 0 ? (
              <div className="empty-column-notice">
                <CheckCircle2 size={24} className="text-emerald" />
                <span>All systemic prerequisites satisfied!</span>
              </div>
            ) : (
              prereqNodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const isHighlighted = connectedNodeIds.has(node.id);
                const isSatisfied = node.status === 'satisfied';
                return (
                  <div 
                    key={node.id}
                    className={`graph-node prereq-node ${isSatisfied ? 'satisfied' : 'blocking'} ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    <div className={`node-badge-prereq ${isSatisfied ? 'badge-satisfied' : 'badge-blocker'}`}>
                      {isSatisfied ? 'RESOLVED' : 'PREREQUISITE GAP'}
                    </div>
                    <div className="node-label">{node.label}</div>
                    <div className="node-sub">{node.sub}</div>
                    <div className={`node-status-chip ${isSatisfied ? 'satisfied' : 'blocking'}`}>
                      {isSatisfied ? <CheckCircle2 size={11} /> : <ShieldAlert size={11} />}
                      {isSatisfied ? 'Active in System' : 'Action Blocker'}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 3: Evidence Gaps */}
        <div className="graph-column col-evidence">
          <div className="column-header">
            <span className="col-num">3</span>
            <div className="col-header-text">
              <h4>Evidence Proofs</h4>
              <span>Certificates & Documents</span>
            </div>
          </div>
          <div className="column-nodes">
            {evidenceNodes.length === 0 ? (
              <div className="empty-column-notice">
                <CheckCircle2 size={24} className="text-emerald" />
                <span>All documents verified!</span>
              </div>
            ) : (
              evidenceNodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const isHighlighted = connectedNodeIds.has(node.id);
                return (
                  <div 
                    key={node.id}
                    className={`graph-node evidence-node ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    <div className="node-badge-evidence">EVIDENCE GAP</div>
                    <div className="node-label">{node.label}</div>
                    <div className="node-sub">{node.sub}</div>
                    <div className="node-status-chip missing">
                      <AlertTriangle size={11} /> Needs Verification
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 4: Scheme Targets */}
        <div className="graph-column col-schemes">
          <div className="column-header">
            <span className="col-num">4</span>
            <div className="col-header-text">
              <h4>Target Schemes</h4>
              <span>Government Benefits</span>
            </div>
          </div>
          <div className="column-nodes">
            {schemeNodes.map(node => {
              const isSelected = selectedNodeId === node.id;
              const isHighlighted = connectedNodeIds.has(node.id);
              const isReady = node.status === 'READY_TO_APPLY';
              return (
                <div 
                  key={node.id}
                  className={`graph-node scheme-node ${isReady ? 'ready' : 'blocked'} ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                  onClick={() => setSelectedNodeId(node.id)}
                >
                  <div className={`node-badge-scheme ${isReady ? 'ready' : 'blocked'}`}>
                    {isReady ? 'READY TO APPLY' : 'BLOCKED BY GAPS'}
                  </div>
                  <div className="node-label">{node.label}</div>
                  <div className="node-sub font-mono">{node.sub}</div>
                  <div className={`node-status-chip ${isReady ? 'satisfied' : 'blocking'}`}>
                    {isReady ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
                    {isReady ? 'All Clear' : 'Gaps Pending'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Node Inspector Drawer */}
      {selectedNode && (
        <div className="node-inspector-bar">
          <div className="inspector-content">
            <div className="inspector-left">
              <span className={`inspector-tag ${selectedNode.type}`}>
                {selectedNode.type.toUpperCase()}
              </span>
              <h4 className="inspector-title">{selectedNode.label}</h4>
              <p className="inspector-desc">
                {selectedNode.type === 'prerequisite' && selectedNode.fullData?.description}
                {selectedNode.type === 'evidence' && selectedNode.fullData?.description}
                {selectedNode.type === 'fact' && `Citizen ground truth fact verified from active intake profile: ${selectedNode.label}.`}
                {selectedNode.type === 'scheme' && `Benefit Target: ${selectedNode.sub}. Explore resolution steps to unlock.`}
              </p>

              {selectedNode.fullData?.whyItBlocks && (
                <div className="inspector-why-box">
                  <strong>Why this blocks you:</strong> {selectedNode.fullData.whyItBlocks}
                </div>
              )}
            </div>

            <div className="inspector-actions">
              {selectedNode.fullData?.resolutionUrl && (
                <a 
                  href={selectedNode.fullData.resolutionUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-inspector-link"
                >
                  <ExternalLink size={14} />
                  <span>{selectedNode.fullData.actionLabel || 'Open Official Portal'}</span>
                </a>
              )}

              {selectedNode.type === 'scheme' && selectedNode.officialPortal && (
                <a 
                  href={selectedNode.officialPortal} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-inspector-link"
                >
                  <ExternalLink size={14} />
                  <span>Open Scheme Portal</span>
                </a>
              )}

              {/* Simulation Quick-Fix */}
              {selectedNode.type === 'prerequisite' && selectedNode.status === 'blocking' && (
                <button 
                  className="btn-simulate-fix"
                  onClick={() => onSimulateFix(selectedNode.fullData.id)}
                >
                  <Check size={14} />
                  <span>Simulate Clearing This Gap</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
