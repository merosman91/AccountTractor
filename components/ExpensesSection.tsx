'use client';

import { useState, useEffect } from 'react';
import { 
  FaCalendar, 
  FaTags, 
  FaMoneyBill, 
  FaStickyNote,
  FaPlusCircle,
  FaTrashAlt,
  FaListAlt,
  FaGasPump,
  FaOilCan,
  FaTools,
  FaCog,
  FaUserTie,
  FaFileAlt
} from 'react-icons/fa';
import { useData } from '@/hooks/useData';
import { useNotification } from '@/hooks/useNotification';
import { ExpenseEntry } from '@/types';

const EXPENSE_TYPES = [
  { value: 'ديزل', label: '⛽ جاز', icon: FaGasPump },
  { value: 'زيت', label: '🛢️ زيت محرك', icon: FaOilCan },
  { value: 'صيانة', label: '🔧 صيانة', icon: FaTools },
  { value: 'قطع غيار', label: '⚙️ قطع غيار', icon: FaCog },
  { value: 'عمال', label: '👷 أجور عمال', icon: FaUserTie },
  { value: 'أخرى', label: '📝 مصاريف أخرى', icon: FaFileAlt },
];

export default function ExpensesSection() {
  const { data, addExpense, removeExpense, clearExpenses } = useData();
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState<Partial<ExpenseEntry>>({
    date: new Date().toISOString().split('T')[0],
    type: 'ديزل',
    amount: 0,
    details: '',
  });

  const totalExpenses = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleSubmit = () => {
    if (!formData.amount || formData.amount <= 0) {
      showNotification('يرجى إدخال مبلغ المصروف', 'error');
      return;
    }

    const newEntry: ExpenseEntry = {
      id: Date.now().toString(),
      date: formData.date || new Date().toISOString().split('T')[0],
      type: formData.type || 'ديزل',
      amount: formData.amount || 0,
      details: formData.details,
      timestamp: new Date().toISOString(),
    };

    addExpense(newEntry);
    
    // إعادة تعيين النموذج
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'ديزل',
      amount: 0,
      details: '',
    });

    showNotification('تم إضافة المصروف بنجاح!', 'success');
  };

  const handleClearAll = () => {
    if (data.expenses.length === 0) {
      showNotification('لا توجد مصاريف لحذفها', 'info');
      return;
    }

    if (confirm(`هل أنت متأكد من حذف جميع المصاريف (${data.expenses.length} مصروف)?`)) {
      clearExpenses();
      showNotification('تم حذف جميع المصاريف', 'success');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
      removeExpense(id);
      showNotification('تم حذف المصروف', 'success');
    }
  };

  return (
    <div className="space-y-8">
      {/* نموذج إضافة مصروف */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FaPlusCircle className="text-accent-600 mr-3 text-2xl" />
          تسجيل مصروف جديد
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* التاريخ */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
              <FaCalendar className="mr-2" />
              التاريخ
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="input-field"
            />
          </div>

          {/* نوع المصروف */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
              <FaTags className="mr-2" />
              نوع المصروف
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="input-field"
            >
              {EXPENSE_TYPES.map(exp => (
                <option key={exp.value} value={exp.value}>
                  {exp.label}
                </option>
              ))}
            </select>
          </div>

          {/* المبلغ */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
              <FaMoneyBill className="mr-2" />
              المبلغ (جنيه)
            </label>
            <input
              type="number"
              value={formData.amount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
              min="0"
              step="0.01"
              className="input-field"
            />
          </div>

          {/* تفاصيل */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
              <FaStickyNote className="mr-2" />
              تفاصيل إضافية (اختياري)
            </label>
            <input
              type="text"
              value={formData.details || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              placeholder="مثال: 100 لتر جاز من محطة..."
              className="input-field"
            />
          </div>
        </div>

        {/* زر الإضافة */}
        <button
          onClick={handleSubmit}
          className="btn-secondary w-full text-xl py-4"
        >
          <FaPlusCircle className="inline-block ml-2" />
          إضافة مصروف
        </button>
      </div>

      {/* قائمة المصاريف */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaListAlt className="text-red-600 mr-3 text-2xl" />
            سجل المصاريف
          </h3>
          
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold text-gray-700">
              إجمالي المصاريف: 
              <span className="text-red-600 font-bold text-2xl mr-2">
                {totalExpenses.toLocaleString()}
              </span>
              جنيه
            </div>
            <button
              onClick={handleClearAll}
              className="btn-danger text-sm py-2 px-4"
            >
              <FaTrashAlt className="inline-block ml-1" />
              حذف الكل
            </button>
          </div>
        </div>

        {data.expenses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FaListAlt className="text-4xl mb-4 mx-auto" />
            <p>لا توجد مصاريف مسجلة</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto p-2">
            {data.expenses.slice().reverse().map(expense => {
              const expenseType = EXPENSE_TYPES.find(t => t.value === expense.type);
              const Icon = expenseType?.icon || FaFileAlt;
              
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      <Icon className="text-gray-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">
                        {expenseType?.label || expense.type}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {expense.date}
                        {expense.details && ` • ${expense.details}`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-red-600">
                      {expense.amount.toLocaleString()} ج
                    </span>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
