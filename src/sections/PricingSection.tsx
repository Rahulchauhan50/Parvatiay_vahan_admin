import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { getPricingSettings, updatePricingSettings, type PricingSettings } from '../lib/api';
import { defaultPricing } from '../lib/ui';
import { useAppDispatch } from '../store/hooks';
import { setNotice } from '../store/uiSlice';

export function PricingSection() {
  const dispatch = useAppDispatch();
  const [pricing, setPricing] = useState<PricingSettings>(defaultPricing);

  const pricingQuery = useQuery({
    queryKey: ['pricing-settings'],
    queryFn: getPricingSettings,
  });

  const saveMutation = useMutation({
    mutationFn: () => updatePricingSettings(pricing),
    onSuccess: ({ settings }) => {
      setPricing(settings);
      dispatch(setNotice({ type: 'success', message: 'Pricing settings saved.' }));
    },
    onError: (error) => {
      dispatch(setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to save pricing settings' }));
    },
  });

  const loadCurrent = () => {
    const settings = pricingQuery.data?.settings;
    if (settings) {
      setPricing(settings);
      dispatch(setNotice({ type: 'success', message: 'Pricing settings loaded.' }));
    }
  };

  return (
    <section className="panel section-card">
      <div className="section-header">
        <div>
          <h3>Pricing Settings</h3>
          <p>Controls for new ride validation.</p>
        </div>
        <div className="toolbar">
          <button className="btn secondary" onClick={loadCurrent} disabled={pricingQuery.isFetching}>
            Load Current
          </button>
          <button className="btn primary" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            Save
          </button>
        </div>
      </div>
      <div className="field-grid">
        <label className="form-stack"><span className="small">Min Price Per Seat</span><input type="number" value={pricing.minPricePerSeat} onChange={(event) => setPricing({ ...pricing, minPricePerSeat: Number(event.target.value) })} /></label>
        <label className="form-stack"><span className="small">Max Price Per Seat</span><input type="number" value={pricing.maxPricePerSeat} onChange={(event) => setPricing({ ...pricing, maxPricePerSeat: Number(event.target.value) })} /></label>
        <label className="form-stack"><span className="small">Base Price Per Km</span><input type="number" step="0.5" value={pricing.basePricePerKm} onChange={(event) => setPricing({ ...pricing, basePricePerKm: Number(event.target.value) })} /></label>
        <label className="form-stack"><span className="small">Peak Hour Multiplier</span><input type="number" step="0.1" value={pricing.peakHourMultiplier} onChange={(event) => setPricing({ ...pricing, peakHourMultiplier: Number(event.target.value) })} /></label>
        <label className="form-stack"><span className="small">Peak Hour Start</span><input type="number" value={pricing.peakHourStart} onChange={(event) => setPricing({ ...pricing, peakHourStart: Number(event.target.value) })} /></label>
        <label className="form-stack"><span className="small">Peak Hour End</span><input type="number" value={pricing.peakHourEnd} onChange={(event) => setPricing({ ...pricing, peakHourEnd: Number(event.target.value) })} /></label>
        <label className="form-stack"><span className="small">Surge Threshold</span><input type="number" value={pricing.surgeThreshold} onChange={(event) => setPricing({ ...pricing, surgeThreshold: Number(event.target.value) })} /></label>
        <label className="form-stack"><span className="small">Cancellation Charge %</span><input type="number" value={pricing.cancellationChargePercent} onChange={(event) => setPricing({ ...pricing, cancellationChargePercent: Number(event.target.value) })} /></label>
        <label className="form-stack"><span className="small">Surge Pricing</span>
          <select value={String(pricing.surgePricingEnabled)} onChange={(event) => setPricing({ ...pricing, surgePricingEnabled: event.target.value === 'true' })}>
            <option value="false">Disabled</option>
            <option value="true">Enabled</option>
          </select>
        </label>
      </div>
    </section>
  );
}
