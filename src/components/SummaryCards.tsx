import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Summary } from '../types';
import { formatCurrencyParts } from '../utils/format';

interface SummaryCardsProps { summary: Summary; }

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.floor(ease * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!started.current) return;
    let raf: number;
    const start = performance.now();
    const from = value;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 600, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.floor(from + ease * (target - from)));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

interface CardConfig {
  label: string;
  subLabel: string;
  amount: number;
  icon: React.ReactNode;
  arrowIcon: React.ReactNode;
  color: string;
  dimColor: string;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
  trend: string;
}

const MetricCard: React.FC<CardConfig> = ({
  label, subLabel, amount, icon, arrowIcon,
  color, dimColor, borderColor, gradientFrom, gradientTo, trend,
}) => {
  const display = useCountUp(amount);
  const { integer } = formatCurrencyParts(display);

  return (
    <div className="card card-glow" style={{ padding: '24px', flex: '1 1 200px', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '160px', height: '160px',
        background: `radial-gradient(circle, ${dimColor} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '13px',
          background: dimColor, border: `1px solid ${borderColor}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color,
        }}>
          {icon}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '4px 10px',
          background: dimColor, border: `1px solid ${borderColor}`,
          borderRadius: '20px', fontSize: '12px', fontWeight: 600, color,
        }}>
          {arrowIcon}{trend}
        </div>
      </div>

      {/* Amount — ₺ sembolü küçük, rakam büyük ve tabular */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
        <span style={{
          fontSize: '15px',
          fontWeight: 700,
          color,
          opacity: 0.75,
          fontFamily: 'Inter, sans-serif',
          lineHeight: 1,
        }}>
          ₺
        </span>
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 800,
          fontSize: '30px',
          letterSpacing: '-1px',
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum"',
          lineHeight: 1,
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {integer}
        </span>
      </div>

      <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>
        {label}
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
        {subLabel}
      </div>

      {/* Bottom accent bar */}
      <div style={{
        marginTop: '20px', height: '3px', borderRadius: '99px',
        background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
        opacity: 0.6,
      }} />
    </div>
  );
};

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const isPositive = summary.netBalance >= 0;
  const savingsRate = summary.totalIncome > 0
    ? ((summary.netBalance / summary.totalIncome) * 100).toFixed(0)
    : '0';

  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
      <MetricCard
        label="Toplam Gelir"
        subLabel="Bu dönemdeki gelirler"
        amount={summary.totalIncome}
        icon={<TrendingUp size={20} />}
        arrowIcon={<ArrowUpRight size={13} />}
        color="var(--accent-green)"
        dimColor="rgba(0,229,160,0.08)"
        borderColor="rgba(0,229,160,0.2)"
        gradientFrom="#00e5a0"
        gradientTo="#38bdf8"
        trend="Gelir"
      />
      <MetricCard
        label="Toplam Gider"
        subLabel="Bu dönemdeki giderler"
        amount={summary.totalExpense}
        icon={<TrendingDown size={20} />}
        arrowIcon={<ArrowDownRight size={13} />}
        color="var(--accent-red)"
        dimColor="rgba(255,77,109,0.08)"
        borderColor="rgba(255,77,109,0.2)"
        gradientFrom="#ff4d6d"
        gradientTo="#fb923c"
        trend="Gider"
      />
      <MetricCard
        label="Net Bakiye"
        subLabel={`Tasarruf oranı %${savingsRate}`}
        amount={Math.abs(summary.netBalance)}
        icon={<DollarSign size={20} />}
        arrowIcon={isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        color={isPositive ? 'var(--accent-blue)' : 'var(--accent-red)'}
        dimColor={isPositive ? 'rgba(56,189,248,0.08)' : 'rgba(255,77,109,0.08)'}
        borderColor={isPositive ? 'rgba(56,189,248,0.2)' : 'rgba(255,77,109,0.2)'}
        gradientFrom={isPositive ? '#38bdf8' : '#ff4d6d'}
        gradientTo={isPositive ? '#8b5cf6' : '#fb923c'}
        trend={isPositive ? 'Pozitif' : 'Negatif'}
      />
    </div>
  );
};

export default SummaryCards;
