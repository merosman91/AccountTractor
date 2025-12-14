'use client';

import { useState, useEffect } from 'react';
import { 
  FaMoneyBillWave, 
  FaGasPump, 
  FaChartLine,
  FaTractor,
  FaUsers,
  FaFileExport,
  FaDatabase 
} from 'react-icons/fa';
import StatsCard from '@/components/StatsCard';
import WorkSection from '@/components/WorkSection';
import ExpensesSection from '@/components/ExpensesSection';
import ClientsSection from '@/components/ClientsSection';
import ReportsSection from '@/components/ReportsSection';
import BackupSection from '@/components/BackupSection';
import { useData } from '@/hooks/useData';
import { calculateStats } from '@/utils/calculations';

export default function HomePage() {
  const { data } = useData();
  const [activeTab, setActiveTab] = useState('work');
  const stats = calculateStats(data);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && ['work', 'expenses', 'clients', 'reports', 'backup'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'work':
        return <WorkSection />;
      case 'expenses':
        return <ExpensesSection />;
      case 'clients':
        return <ClientsSection />;
      case 'reports':
        return <ReportsSection />;
      case 'backup':
        return <BackupSection />;
      default:
        return <WorkSection />;
    }
  };

  return (
    <div className="space-y-8">
      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="إجمالي العمل"
          value={stats.totalIncome}
          icon={<FaMoneyBillWave />}
          color="green"
        />
        <StatsCard
          title="إجمالي المصاريف"
          value={stats.totalExpenses}
          icon={<FaGasPump />}
          color="orange"
        />
        <StatsCard
          title="صافي الربح"
          value={stats.netProfit}
          icon={<FaChartLine />}
          color="blue"
        />
      </div>

      {/* تبويبات المحتوى */}
      <div className="card">
        <div className="flex flex-wrap border-b border-gray-200 mb-6">
          {[
            { id: 'work', label: 'أعمال الميدان', icon: FaTractor },
            { id: 'expenses', label: 'المصاريف', icon: FaGasPump },
            { id: 'clients', label: 'سجل الزبائن', icon: FaUsers },
            { id: 'reports', label: 'التقارير', icon: FaChartLine },
            { id: 'backup', label: 'النسخ الاحتياطي', icon: FaDatabase },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.location.hash = tab.id;
              }}
              className={`flex-1 py-4 px-2 text-center font-semibold text-lg transition-all ${
                activeTab === tab.id 
                  ? 'tab-active' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="inline-block ml-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* محتوى التبويب */}
        <div className="animate-fade-in">
          {renderTab()}
        </div>
      </div>
    </div>
  );
  } 
