import React, { useState } from 'react';
import { Plus, CheckCircle2, AlertCircle, Tag, FileText, Banknote, Calendar } from 'lucide-react';
import type { Transaction, TransactionType, Category } from '../types';

const INCOME_CATEGORIES: Category[] = ['Maaş', 'Freelance', 'Yatırım', 'Diğer Gelir'];
const EXPENSE_CATEGORIES: Category[] = ['Kira', 'Market', 'Ulaşım', 'Sağlık', 'Eğlence', 'Faturalar', 'Yemek', 'Diğer Gider'];

interface AddTransactionProps {
  onAdd: (tx: Omit<Transaction, 'id'>) => void;
}

const FieldLabel: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <label style={{
    display: 'flex', alignItems: 'center', gap: '6px',
    color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.6px',
    marginBottom: '7px',
  }}>
    <span style={{ color: 'var(--text-muted)', opacity: 0.8 }}>{icon}</span>
    {text}
  </label>
);

const AddTransaction: React.FC<AddTransactionProps> = ({ onAdd }) => {
  const today = new Date().toISOString().split('T')[0];
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<Category | ''>('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(today);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string; category?: string }>({});

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (t: TransactionType) => {
    setType(t);
    setCategory('');
    setErrors({});
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!amount || Number(amount) <= 0) e.amount = 'Geçerli bir tutar girin';
    if (!category) e.category = 'Kategori seçin';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onAdd({
      type, amount: Number(amount),
      category: category as Category,
      description: description.trim() || (type === 'income' ? 'Gelir' : 'Gider'),
      date: date || today,
    });
    setCategory(''); setDescription(''); setAmount(''); setDate(today); setErrors({});
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2200);
  };

  const isIncome = type === 'income';
  const activeColor = isIncome ? 'var(--accent-green)' : 'var(--accent-red)';
  const activeDim   = isIncome ? 'rgba(0,229,160,0.08)' : 'rgba(255,77,109,0.08)';
  const activeBorder = isIncome ? 'rgba(0,229,160,0.25)' : 'rgba(255,77,109,0.25)';

  return (
    <div className="card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '9px',
          background: activeDim, border: `1px solid ${activeBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s', color: activeColor,
        }}>
          <Plus size={16} />
        </div>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
            Yeni İşlem
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Gelir veya gider ekle</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>

        {/* Type toggle */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          background: 'var(--bg-input)', borderRadius: '12px',
          padding: '4px', gap: '4px',
          border: '1px solid var(--border)',
        }}>
          {(['income', 'expense'] as TransactionType[]).map(t => (
            <button key={t} type="button" onClick={() => handleTypeChange(t)}
              style={{
                padding: '9px 0', borderRadius: '9px',
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px',
                cursor: 'pointer', border: 'none',
                transition: 'all 0.22s',
                background: type === t
                  ? t === 'income' ? 'rgba(0,229,160,0.15)' : 'rgba(255,77,109,0.15)'
                  : 'transparent',
                color: type === t
                  ? t === 'income' ? 'var(--accent-green)' : 'var(--accent-red)'
                  : 'var(--text-muted)',
                boxShadow: type === t ? `0 0 16px ${t === 'income' ? 'rgba(0,229,160,0.1)' : 'rgba(255,77,109,0.1)'}` : 'none',
              }}>
              {t === 'income' ? '↑ Gelir' : '↓ Gider'}
            </button>
          ))}
        </div>

        {/* Category */}
        <div>
          <FieldLabel icon={<Tag size={11} />} text="Kategori" />
          <select value={category}
            onChange={e => { setCategory(e.target.value as Category); setErrors(p => ({ ...p, category: undefined })); }}
            className="inp"
            style={{ borderColor: errors.category ? 'var(--accent-red)' : undefined }}>
            <option value="">Kategori seçin…</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px', color: 'var(--accent-red)', fontSize: '12px' }}>
              <AlertCircle size={12} /> {errors.category}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <FieldLabel icon={<FileText size={11} />} text="Açıklama" />
          <input type="text" placeholder="İşlem açıklaması…"
            value={description} onChange={e => setDescription(e.target.value)}
            className="inp" />
        </div>

        {/* Amount */}
        <div>
          <FieldLabel icon={<Banknote size={11} />} text="Tutar" />
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)',
              color: activeColor, fontWeight: 700, fontSize: '14px', pointerEvents: 'none',
            }}>₺</span>
            <input type="number" placeholder="0" min="1"
              value={amount}
              onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: undefined })); }}
              className="inp"
              style={{ paddingLeft: '28px', borderColor: errors.amount ? 'var(--accent-red)' : undefined }} />
          </div>
          {errors.amount && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px', color: 'var(--accent-red)', fontSize: '12px' }}>
              <AlertCircle size={12} /> {errors.amount}
            </div>
          )}
        </div>

        {/* Date */}
        <div>
          <FieldLabel icon={<Calendar size={11} />} text="Tarih" />
          <input type="date" value={date}
            onChange={e => setDate(e.target.value)}
            className="inp"
            style={{ colorScheme: 'dark' }} />
        </div>

        {/* Submit */}
        <button type="submit" style={{
          marginTop: 'auto',
          padding: '13px',
          borderRadius: '12px',
          fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px',
          cursor: 'pointer', border: 'none',
          letterSpacing: '0.2px',
          transition: 'all 0.25s',
          ...(success ? {
            background: 'rgba(0,229,160,0.12)',
            color: 'var(--accent-green)',
            boxShadow: '0 0 20px rgba(0,229,160,0.15)',
            border: '1px solid rgba(0,229,160,0.3)',
          } : {
            background: 'linear-gradient(135deg, #8b5cf6 0%, #38bdf8 100%)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
          }),
        }}>
          {success ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> Başarıyla Eklendi
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Plus size={16} /> İşlem Ekle
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
