import './index.css';
import { useTransactions } from './hooks/useTransactions';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import PieChart from './components/PieChart';
import AddTransaction from './components/AddTransaction';
import TransactionList from './components/TransactionList';

function App() {
  const { transactions, summary, addTransaction, deleteTransaction, chartData, incomeChartData } = useTransactions();

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '28px 24px 48px' }}>

        <Header summary={summary} />

        <SummaryCards summary={summary} />

        {/* Middle section: Chart + Form side by side */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(280px, 1fr)',
          gap: '16px',
          marginBottom: '16px',
          alignItems: 'stretch',
        }}
          className="mid-grid"
        >
          <PieChart chartData={chartData} incomeChartData={incomeChartData} />
          <AddTransaction onAdd={addTransaction} />
        </div>

        <TransactionList transactions={transactions} onDelete={deleteTransaction} />
      </div>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 720px) {
          .mid-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
