import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type Plugin,
} from 'chart.js';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/format';

ChartJS.register(ArcElement, Tooltip, Legend);

const EXPENSE_COLORS: Record<string, string> = {
  'Kira':        '#ff4d6d',
  'Market':      '#fb923c',
  'Ulaşım':      '#fbbf24',
  'Faturalar':   '#34d399',
  'Yemek':       '#38bdf8',
  'Eğlence':     '#a78bfa',
  'Sağlık':      '#f472b6',
  'Diğer Gider': '#6b7280',
};

const INCOME_COLORS: Record<string, string> = {
  'Maaş':        '#00e5a0',
  'Freelance':   '#38bdf8',
  'Yatırım':     '#8b5cf6',
  'Diğer Gelir': '#34d399',
};

type Tab = 'expense' | 'income';

interface PieChartProps {
  chartData: Record<string, number>;
  incomeChartData: Record<string, number>;
}

const ChartView: React.FC<{
  data: Record<string, number>;
  colors: Record<string, string>;
  tab: Tab;
}> = ({ data, colors, tab }) => {
  const labels = Object.keys(data);
  const values = Object.values(data);
  const total = values.reduce((s, v) => s + v, 0);
  const palette = labels.map(l => colors[l] ?? '#6b7280');

  const isExpense = tab === 'expense';

  const centerTextPlugin: Plugin<'doughnut'> = {
    id: 'centerText',
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      const cx = (chartArea.left + chartArea.right) / 2;
      const cy = (chartArea.top + chartArea.bottom) / 2;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(160,160,192,0.7)';
      ctx.font = '500 11px Inter, sans-serif';
      ctx.fillText(isExpense ? 'TOPLAM GİDER' : 'TOPLAM GELİR', cx, cy - 13);
      ctx.fillStyle = '#f0f0f8';
      ctx.font = '700 17px Syne, sans-serif';
      ctx.fillText(formatCurrency(total), cx, cy + 8);
      ctx.restore();
    },
  };

  const chartJsData = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: palette.map(c => c + 'bb'),
      borderColor: palette,
      borderWidth: 2,
      hoverBackgroundColor: palette,
      hoverOffset: 6,
    }],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    animation: { animateRotate: true, duration: 900 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#12121f',
        borderColor: '#2a2a48',
        borderWidth: 1,
        titleColor: '#f0f0f8',
        bodyColor: '#a0a0c0',
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label(ctx) {
            const val = ctx.parsed;
            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0';
            return `  ${formatCurrency(val)}  (%${pct})`;
          },
        },
      },
    },
  };

  if (labels.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '220px', gap: '10px',
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: isExpense ? 'rgba(255,77,109,0.08)' : 'rgba(0,229,160,0.08)',
          border: `1px solid ${isExpense ? 'rgba(255,77,109,0.2)' : 'rgba(0,229,160,0.2)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isExpense
            ? <TrendingDown size={22} color="var(--accent-red)" />
            : <TrendingUp size={22} color="var(--accent-green)" />
          }
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          Henüz {isExpense ? 'gider' : 'gelir'} işlemi yok
        </p>
      </div>
    );
  }

  const sorted = labels
    .map((l, i) => ({ label: l, value: values[i], color: palette[i] }))
    .sort((a, b) => b.value - a.value);

  return (
    <>
      <div style={{ position: 'relative', height: '200px', flexShrink: 0 }}>
        <Doughnut data={chartJsData} options={options} plugins={[centerTextPlugin]} />
      </div>

      <div style={{ height: '1px', background: 'var(--border)', margin: '18px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'auto', flex: 1 }}>
        {sorted.map(({ label, value, color }) => {
          const pct = total > 0 ? (value / total) * 100 : 0;
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: color, flexShrink: 0,
                boxShadow: `0 0 6px ${color}88`,
              }} />
              <span style={{ flex: 1, color: 'var(--text-secondary)', fontSize: '13px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {label}
              </span>
              <div style={{ width: '60px', height: '4px', borderRadius: '99px', background: 'var(--bg-input)', overflow: 'hidden', flexShrink: 0 }}>
                <div style={{
                  height: '100%', borderRadius: '99px',
                  background: color, width: `${pct}%`,
                  transition: 'width 0.8s cubic-bezier(.16,1,.3,1)',
                }} />
              </div>
              <span style={{
                color: 'var(--text-primary)', fontWeight: 700, fontSize: '13px', flexShrink: 0,
                fontFamily: 'Inter, sans-serif',
                fontVariantNumeric: 'tabular-nums',
                fontFeatureSettings: '"tnum"',
                letterSpacing: '-0.2px',
              }}>
                {formatCurrency(value)}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};

const PieChart: React.FC<PieChartProps> = ({ chartData, incomeChartData }) => {
  const [tab, setTab] = useState<Tab>('expense');

  const tabs: { key: Tab; label: string; icon: React.ReactNode; color: string; dimColor: string; borderColor: string }[] = [
    {
      key: 'expense',
      label: 'Gider',
      icon: <TrendingDown size={13} />,
      color: 'var(--accent-red)',
      dimColor: 'rgba(255,77,109,0.12)',
      borderColor: 'rgba(255,77,109,0.3)',
    },
    {
      key: 'income',
      label: 'Gelir',
      icon: <TrendingUp size={13} />,
      color: 'var(--accent-green)',
      dimColor: 'rgba(0,229,160,0.12)',
      borderColor: 'rgba(0,229,160,0.3)',
    },
  ];

  const activeTab = tabs.find(t => t.key === tab)!;

  return (
    <div className="card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
            Dağılım Analizi
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
            Kategoriye göre
          </div>
        </div>

        {/* Tab toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '3px',
          gap: '3px',
        }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 12px',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '12px',
                transition: 'all 0.2s',
                background: tab === t.key ? t.dimColor : 'transparent',
                color: tab === t.key ? t.color : 'var(--text-muted)',
                boxShadow: tab === t.key ? `0 0 12px ${t.dimColor}` : 'none',
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active tab indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '6px 12px',
        background: activeTab.dimColor,
        border: `1px solid ${activeTab.borderColor}`,
        borderRadius: '8px',
        marginBottom: '18px',
        width: 'fit-content',
      }}>
        <span style={{ color: activeTab.color }}>{activeTab.icon}</span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: activeTab.color }}>
          {tab === 'expense' ? 'Gider' : 'Gelir'} dağılımı gösteriliyor
        </span>
      </div>

      {/* Chart content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <ChartView
          key={tab}
          data={tab === 'expense' ? chartData : incomeChartData}
          colors={tab === 'expense' ? EXPENSE_COLORS : INCOME_COLORS}
          tab={tab}
        />
      </div>
    </div>
  );
};

export default PieChart;
