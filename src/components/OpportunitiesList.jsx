import React, { useState } from 'react';
import { OpportunityCard } from './OpportunityCard';
import { Search, Filter, CheckCircle2, ShieldAlert, AlertTriangle, XCircle } from 'lucide-react';

export function OpportunitiesList({ evaluationResults, onSimulatePrereqFix, onAskAi }) {
  const [activeStatusTab, setActiveStatusTab] = useState('ALL_MATCHES'); // 'ALL_MATCHES' | 'READY' | 'BLOCKED' | 'NOT_ELIGIBLE'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'Agriculture', 'Healthcare', 'Housing', 'Livelihood & Credit', 'Education', 'Child & Girl Welfare', 'Energy & Fuel', 'Retirement & Pension', 'Direct Benefit Transfer'];

  const filteredResults = evaluationResults.filter(item => {
    // Status Filter
    if (activeStatusTab === 'ALL_MATCHES' && item.status === 'NOT_ELIGIBLE') return false;
    if (activeStatusTab === 'READY' && item.status !== 'READY_TO_APPLY') return false;
    if (activeStatusTab === 'BLOCKED' && item.status !== 'ACTION_BLOCKED' && item.status !== 'POTENTIAL_WITH_GAPS') return false;
    if (activeStatusTab === 'NOT_ELIGIBLE' && item.status !== 'NOT_ELIGIBLE') return false;

    // Category Filter
    if (selectedCategory !== 'ALL' && item.scheme.category !== selectedCategory) return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.scheme.name.toLowerCase().includes(q);
      const matchShort = item.scheme.shortName.toLowerCase().includes(q);
      const matchDesc = item.scheme.description.toLowerCase().includes(q);
      const matchCategory = item.scheme.category.toLowerCase().includes(q);
      return matchName || matchShort || matchDesc || matchCategory;
    }

    return true;
  });

  const readyCount = evaluationResults.filter(r => r.status === 'READY_TO_APPLY').length;
  const blockedCount = evaluationResults.filter(r => r.status === 'ACTION_BLOCKED' || r.status === 'POTENTIAL_WITH_GAPS').length;
  const ineligibleCount = evaluationResults.filter(r => r.status === 'NOT_ELIGIBLE').length;
  const totalMatchesCount = evaluationResults.filter(r => r.status !== 'NOT_ELIGIBLE').length;

  return (
    <div className="opportunities-container">
      {/* Controls Bar */}
      <div className="opportunities-controls">
        {/* Status Filter Tabs */}
        <div className="status-tabs-row">
          <button 
            className={`status-filter-tab ${activeStatusTab === 'ALL_MATCHES' ? 'active' : ''}`}
            onClick={() => setActiveStatusTab('ALL_MATCHES')}
          >
            <span>All Potential Matches</span>
            <span className="count-tag">{totalMatchesCount}</span>
          </button>

          <button 
            className={`status-filter-tab ready-tab ${activeStatusTab === 'READY' ? 'active' : ''}`}
            onClick={() => setActiveStatusTab('READY')}
          >
            <CheckCircle2 size={13} />
            <span>Ready to Apply</span>
            <span className="count-tag count-ready">{readyCount}</span>
          </button>

          <button 
            className={`status-filter-tab blocked-tab ${activeStatusTab === 'BLOCKED' ? 'active' : ''}`}
            onClick={() => setActiveStatusTab('BLOCKED')}
          >
            <ShieldAlert size={13} />
            <span>Action Blocked by Gaps</span>
            <span className="count-tag count-blocked">{blockedCount}</span>
          </button>

          <button 
            className={`status-filter-tab inelig-tab ${activeStatusTab === 'NOT_ELIGIBLE' ? 'active' : ''}`}
            onClick={() => setActiveStatusTab('NOT_ELIGIBLE')}
          >
            <XCircle size={13} />
            <span>Ineligible Schemes</span>
            <span className="count-tag">{ineligibleCount}</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="search-filter-row">
          <div className="search-input-wrap">
            <Search size={15} />
            <input 
              type="text" 
              placeholder="Search scheme name, ministry, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>

          <div className="category-select-wrap">
            <Filter size={14} />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List of Opportunities */}
      <div className="opportunities-cards-list">
        {filteredResults.length === 0 ? (
          <div className="empty-results-box">
            <ShieldAlert size={32} className="text-muted" />
            <h4>No schemes found matching this filter</h4>
            <p>Try clearing your search query or selecting a different category.</p>
          </div>
        ) : (
          filteredResults.map(item => (
            <OpportunityCard 
              key={item.scheme.id}
              evaluation={item}
              onSimulatePrereqFix={onSimulatePrereqFix}
              onAskAi={onAskAi}
            />
          ))
        )}
      </div>
    </div>
  );
}
