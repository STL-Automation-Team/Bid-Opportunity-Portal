import { format } from 'date-fns';
import React from 'react';
import ReactSlider from 'react-slider';
import './EnhancedFilterControls.css';

const EnhancedFilterControls = ({ filters, handleFilterChange }) => {
  const formatDate = (date) => format(new Date(date), 'MMM dd, yyyy');
  const formatCurrency = (value) => `₹${value.toLocaleString('en-IN')}`;

  const renderThumb = (props, state, dataType) => (
    <div {...props} className="thumb">
      <div className="thumb-value">
        {dataType === 'currency' ? formatCurrency(state.valueNow) : formatDate(state.valueNow)}
      </div>
    </div>
  );

  return (
    <div className="enhanced-filter-container">
      <div className="filter-row">
        <div className="filter-column">
          <h4>Price Range</h4>
          <ReactSlider
            className="horizontal-slider"
            thumbClassName="thumb"
            trackClassName="track"
            defaultValue={[filters.amountMin || 0, filters.amountMax || 5000000000]}
            ariaLabel={['Lower price', 'Upper price']}
            ariaValuetext={state => formatCurrency(state.valueNow)}
            renderThumb={(props, state) => renderThumb(props, state, 'currency')}
            pearling
            minDistance={100000}
            step={100000}
            min={0}
            max={5000000000}
            onChange={([min, max]) => {
              handleFilterChange('amountMin', min);
              handleFilterChange('amountMax', max);
            }}
          />
        </div>
        <div className="filter-column">
          <h4>Published Date Range</h4>
          <ReactSlider
            className="horizontal-slider"
            thumbClassName="thumb"
            trackClassName="track"
            defaultValue={[
              filters.publishedDateStart ? new Date(filters.publishedDateStart).getTime() : Date.now() - 30 * 24 * 60 * 60 * 1000,
              filters.publishedDateEnd ? new Date(filters.publishedDateEnd).getTime() : Date.now()
            ]}
            ariaLabel={['Start date', 'End date']}
            ariaValuetext={state => formatDate(state.valueNow)}
            renderThumb={(props, state) => renderThumb(props, state, 'date')}
            pearling
            minDistance={24 * 60 * 60 * 1000}
            min={new Date('2020-01-01').getTime()}
            max={Date.now()}
            onChange={([start, end]) => {
              handleFilterChange('publishedDateStart', format(new Date(start), 'yyyy-MM-dd'));
              handleFilterChange('publishedDateEnd', format(new Date(end), 'yyyy-MM-dd'));
            }}
          />
        </div>
      </div>
      <div className="filter-row">
        <div className="filter-column">
          <h4>Closing Date Range</h4>
          <ReactSlider
            className="horizontal-slider"
            thumbClassName="thumb"
            trackClassName="track"
            defaultValue={[
              filters.closingDateStart ? new Date(filters.closingDateStart).getTime() : Date.now(),
              filters.closingDateEnd ? new Date(filters.closingDateEnd).getTime() : Date.now() + 30 * 24 * 60 * 60 * 1000
            ]}
            ariaLabel={['Start date', 'End date']}
            ariaValuetext={state => formatDate(state.valueNow)}
            renderThumb={(props, state) => renderThumb(props, state, 'date')}
            pearling
            minDistance={24 * 60 * 60 * 1000}
            min={Date.now()}
            max={Date.now() + 365 * 24 * 60 * 60 * 1000}
            onChange={([start, end]) => {
              handleFilterChange('closingDateStart', format(new Date(start), 'yyyy-MM-dd'));
              handleFilterChange('closingDateEnd', format(new Date(end), 'yyyy-MM-dd'));
            }}
          />
        </div>
        <div className="filter-column">
          <h4>Search</h4>
          <input
            type="text"
            placeholder="Organization"
            value={filters.organization}
            onChange={(e) => handleFilterChange('organization', e.target.value)}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Keyword"
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            className="filter-input"
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedFilterControls;