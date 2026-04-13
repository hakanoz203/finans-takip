import React from 'react';
import { TrendingUp, Wallet, Bell } from 'lucide-react';
import type { Summary } from '../types';
import { formatCurrency } from '../utils/format';

interface HeaderProps {
  summary: Summary;
}

const Header: React.FC<HeaderProps> = ({ summary }) => {
  const isPositive = summary.netBalance >= 0;
  const today = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header style={{ marginBottom: '32px' }}>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 28px',
        background: 'rgba(18,18,31,0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        marginBottom: '24px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #38bdf8 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(139,92,246,0.35)',
          }}>
            <TrendingUp size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '20px',
              background: 'linear-gradient(135deg, #e0d7ff, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.3px',
            }}>
              FinansIQ
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '-2px' }}>
              Kişisel Finans Takibi
            </div>
          </div>
        </div>

        {/* Center — date */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 16px',
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          color: 'var(--text-secondary)',
          fontSize: '13px',
        }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bugün</span>
          <span style={{ color: 'var(--border-bright)' }}>·</span>
          <span>{today}</span>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Balance pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px',
            background: isPositive ? 'rgba(0,229,160,0.08)' : 'rgba(255,77,109,0.08)',
            border: `1px solid ${isPositive ? 'rgba(0,229,160,0.25)' : 'rgba(255,77,109,0.25)'}`,
            borderRadius: '10px',
          }}>
            <Wallet size={14} color={isPositive ? 'var(--accent-green)' : 'var(--accent-red)'} />
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: '15px',
              letterSpacing: '-0.3px',
              fontVariantNumeric: 'tabular-nums',
              fontFeatureSettings: '"tnum"',
              color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
            }}>
              {isPositive ? '+' : ''}{formatCurrency(summary.netBalance)}
            </span>
          </div>

          {/* Bell */}
          <button style={{
            width: '38px', height: '38px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-bright)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
          }}>
            <Bell size={16} />
          </button>
        </div>
      </nav>

      {/* Page title row */}
      <div style={{ padding: '0 4px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '28px',
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
          }}>
            Finansal Özet
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Gelir, gider ve harcama dağılımını buradan takip edebilirsin
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 14px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: 'var(--accent-green)',
            boxShadow: '0 0 8px var(--accent-green)',
            animation: 'pulse-ring 2s infinite',
          }} />
          Canlı
        </div>
      </div>
    </header>
  );
};

export default Header;
