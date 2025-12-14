'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppData, WorkEntry, ExpenseEntry } from '@/types';

const STORAGE_KEY = 'tractor_accountant_data';

const defaultData: AppData = {
  work: [],
  expenses: [],
};

export function useData() {
  const [data, setData] = useState<AppData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  // تحميل البيانات من localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          setData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // حفظ البيانات إلى localStorage
  const saveData = useCallback((newData: AppData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, []);

  // إضافة عمل جديد
  const addWorkEntry = useCallback((entry: WorkEntry) => {
    setData(prev => {
      const newData = {
        ...prev,
        work: [...prev.work, entry],
      };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  // إضافة مصروف جديد
  const addExpense = useCallback((expense: ExpenseEntry) => {
    setData(prev => {
      const newData = {
        ...prev,
        expenses: [...prev.expenses, expense],
      };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  // حذف مصروف
  const removeExpense = useCallback((id: string) => {
    setData(prev => {
      const newData = {
        ...prev,
        expenses: prev.expenses.filter(exp => exp.id !== id),
      };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  // حذف جميع المصاريف
  const clearExpenses = useCallback(() => {
    setData(prev => {
      const newData = {
        ...prev,
        expenses: [],
      };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  // تحديث سجل عمل
  const updateWorkEntry = useCallback((id: string, updates: Partial<WorkEntry>) => {
    setData(prev => {
      const newData = {
        ...prev,
        work: prev.work.map(work =>
          work.id === id ? { ...work, ...updates } : work
        ),
      };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  // حذف سجل عمل
  const deleteWorkEntry = useCallback((id: string) => {
    setData(prev => {
      const newData = {
        ...prev,
        work: prev.work.filter(work => work.id !== id),
      };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  // تصدير البيانات
  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tractor_data_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [data]);

  // استيراد البيانات
  const importData = useCallback((importedData: AppData) => {
    setData(importedData);
    saveData(importedData);
  }, [saveData]);

  // إعادة تعيين البيانات
  const resetData = useCallback(() => {
    setData(defaultData);
    saveData(defaultData);
  }, [saveData]);

  return {
    data,
    isLoading,
    addWorkEntry,
    addExpense,
    removeExpense,
    clearExpenses,
    updateWorkEntry,
    deleteWorkEntry,
    exportData,
    importData,
    resetData,
    saveData,
  };
}
