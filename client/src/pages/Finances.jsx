import { useGameStore } from '../store/gameStore';
import Sidebar from '../components/Sidebar';

function Finances() {
  const userTeam = useGameStore(s => s.userTeam);
  const budget = useGameStore(s => s.budget);
  const wageBudget = useGameStore(s => s.wageBudget);
  const totalWages = useGameStore(s => s.totalWages);

  const financialData = {
    revenue: {
      matchday: 45000000,
      broadcasting: 120000000,
      commercial: 85000000,
      other: 15000000
    },
    expenses: {
      wages: totalWages,
      transfers: 65000000,
      facilities: 12000000,
      other: 8000000
    }
  };

  const totalRevenue = Object.values(financialData.revenue).reduce((a, b) => a + b, 0);
  const totalExpenses = Object.values(financialData.expenses).reduce((a, b) => a + b, 0);
  const netBalance = totalRevenue - totalExpenses;

  return (
    <div className="finances-page">
      <Sidebar />
      <main className="finances-content">
        <header className="page-header">
          <h1>FINANCIAL MANAGEMENT</h1>
          <p>{userTeam?.name} - Season Overview</p>
        </header>

        <div className="finance-overview">
          <div className="finance-card glass-card">
            <h3>Transfer Budget</h3>
            <span className="finance-value neon-text-green">€{(budget / 1000000).toFixed(1)}M</span>
          </div>
          <div className="finance-card glass-card">
            <h3>Wage Budget</h3>
            <span className="finance-value neon-text">€{(wageBudget / 1000000).toFixed(1)}M</span>
          </div>
          <div className="finance-card glass-card">
            <h3>Total Wages</h3>
            <span className="finance-value neon-text-pink">€{(totalWages / 1000000).toFixed(1)}M/yr</span>
          </div>
          <div className="finance-card glass-card">
            <h3>Net Balance</h3>
            <span className={`finance-value ${netBalance >= 0 ? 'neon-text-green' : 'neon-text-pink'}`}>
              €{(netBalance / 1000000).toFixed(1)}M
            </span>
          </div>
        </div>

        <div className="finance-breakdown">
          <div className="finance-panel glass-card">
            <h3>💰 REVENUE BREAKDOWN</h3>
            <div className="revenue-chart">
              {Object.entries(financialData.revenue).map(([key, value]) => (
                <div key={key} className="revenue-item">
                  <span className="revenue-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <div className="revenue-bar-bg">
                    <div className="revenue-bar-fill" style={{ width: `${(value / totalRevenue) * 100}%` }} />
                  </div>
                  <span className="revenue-value">€{(value / 1000000).toFixed(0)}M</span>
                </div>
              ))}
            </div>
            <div className="revenue-total">
              <span>Total Revenue</span>
              <span className="neon-text-green">€{(totalRevenue / 1000000).toFixed(0)}M</span>
            </div>
          </div>

          <div className="finance-panel glass-card">
            <h3>💸 EXPENSES BREAKDOWN</h3>
            <div className="expense-chart">
              {Object.entries(financialData.expenses).map(([key, value]) => (
                <div key={key} className="expense-item">
                  <span className="expense-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <div className="expense-bar-bg">
                    <div className="expense-bar-fill" style={{ width: `${(value / totalExpenses) * 100}%` }} />
                  </div>
                  <span className="expense-value">€{(value / 1000000).toFixed(0)}M</span>
                </div>
              ))}
            </div>
            <div className="expense-total">
              <span>Total Expenses</span>
              <span className="neon-text-pink">€{(totalExpenses / 1000000).toFixed(0)}M</span>
            </div>
          </div>
        </div>

        <div className="wage-structure glass-card">
          <h3>👥 WAGE STRUCTURE</h3>
          <div className="wage-chart">
            <div className="wage-bar-container">
              <div className="wage-used" style={{ width: `${(totalWages / wageBudget) * 100}%` }} />
            </div>
            <div className="wage-info">
              <span>Used: {((totalWages / wageBudget) * 100).toFixed(0)}%</span>
              <span>Available: €{((wageBudget - totalWages) / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Finances;
