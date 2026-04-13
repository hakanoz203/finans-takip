import React, { useRef } from 'react';
import { List, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import CategoryBadge from './CategoryBadge';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const sorted = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  const deletingIds = useRef<Set<string>>(new Set());

  const handleDelete = (id: string, el: HTMLElement | null) => {
    if (!el || deletingIds.current.has(id)) return;
    deletingIds.current.add(id);
    el.classList.add('anim-leave');
    setTimeout(() => { onDelete(id); deletingIds.current.delete(id); }, 200);
  };

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '9px',
            background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <List size={15} color="var(--accent-blue)" />
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
              Son İşlemler
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              En yeni {sorted.length} işlem
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Income count */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 12px',
            background: 'rgba(0,229,160,0.07)',
            border: '1px solid rgba(0,229,160,0.18)',
            borderRadius: '20px',
            fontSize: '12px', fontWeight: 600,
            color: 'var(--accent-green)',
          }}>
            <ArrowUpRight size={12} />
            {sorted.filter(t => t.type === 'income').length} Gelir
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 12px',
            background: 'rgba(255,77,109,0.07)',
            border: '1px solid rgba(255,77,109,0.18)',
            borderRadius: '20px',
            fontSize: '12px', fontWeight: 600,
            color: 'var(--accent-red)',
          }}>
            <ArrowDownRight size={12} />
            {sorted.filter(t => t.type === 'expense').length} Gider
          </div>
        </div>
      </div>

      {/* Empty state */}
      {sorted.length === 0 && (
        <div style={{
          padding: '48px 24px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'var(--bg-input)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <List size={24} color="var(--text-muted)" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Henüz işlem yok</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', opacity: 0.6 }}>
            Formu kullanarak ilk işlemini ekle
          </p>
        </div>
      )}

      {/* Table head */}
      {sorted.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 120px 44px',
          padding: '10px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(30,30,53,0.3)',
        }}>
          {['İşlem', 'Tarih', 'Tutar', ''].map((h, i) => (
            <div key={i} style={{
              fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.5px',
              textAlign: i === 2 ? 'right' : 'left',
            }}>{h}</div>
          ))}
        </div>
      )}

      {/* Rows */}
      <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
        {sorted.map(tx => (
          <TxRow key={tx.id} transaction={tx} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

interface TxRowProps {
  transaction: Transaction;
  onDelete: (id: string, el: HTMLElement | null) => void;
}

const TxRow: React.FC<TxRowProps> = ({ transaction: tx, onDelete }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const isIncome = tx.type === 'income';

  return (
    <div
      ref={rowRef}
      className="anim-enter"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 120px 44px',
        alignItems: 'center',
        padding: '12px 24px',
        borderBottom: '1px solid var(--border)',
        transition: 'background 0.15s',
        cursor: 'default',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.04)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Col 1: icon + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <CategoryBadge category={tx.category} type={tx.type} />
        <div style={{ minWidth: 0 }}>
          <div style={{
            color: 'var(--text-primary)', fontWeight: 500, fontSize: '14px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {tx.description}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '1px' }}>
            {tx.category}
          </div>
        </div>
      </div>

      {/* Col 2: date */}
      <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
        {formatDate(tx.date)}
      </div>

      {/* Col 3: amount */}
      <div style={{ textAlign: 'right' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '4px 10px',
          background: isIncome ? 'rgba(0,229,160,0.08)' : 'rgba(255,77,109,0.08)',
          border: `1px solid ${isIncome ? 'rgba(0,229,160,0.2)' : 'rgba(255,77,109,0.2)'}`,
          borderRadius: '20px',
          color: isIncome ? 'var(--accent-green)' : 'var(--accent-red)',
          fontWeight: 700, fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum"',
          letterSpacing: '-0.2px',
        }}>
          {isIncome ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {formatCurrency(tx.amount)}
        </div>
      </div>

      {/* Col 4: delete */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => onDelete(tx.id, rowRef.current)}
          title="Sil"
          style={{
            width: '30px', height: '30px', borderRadius: '8px',
            background: 'transparent', border: '1px solid transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            const b = e.currentTarget;
            b.style.background = 'rgba(255,77,109,0.1)';
            b.style.borderColor = 'rgba(255,77,109,0.25)';
            b.style.color = 'var(--accent-red)';
          }}
          onMouseLeave={e => {
            const b = e.currentTarget;
            b.style.background = 'transparent';
            b.style.borderColor = 'transparent';
            b.style.color = 'var(--text-muted)';
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default TransactionList;
