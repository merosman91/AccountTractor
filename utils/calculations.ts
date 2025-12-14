import { WorkEntry, ExpenseEntry, ClientData, AppData } from '@/types';

// حساب الإحصائيات العامة
export function calculateStats(data: AppData) {
  const totalIncome = data.work.reduce((sum, work) => sum + (work.hours * work.price), 0);
  const totalExpenses = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    netProfit,
    totalJobs: data.work.length,
    totalExpenseItems: data.expenses.length,
  };
}

// تجميع بيانات الزبائن
export function groupClients(workEntries: WorkEntry[]): Record<string, ClientData> {
  const grouped: Record<string, ClientData> = {};

  workEntries.forEach(work => {
    if (!grouped[work.name]) {
      grouped[work.name] = {
        name: work.name,
        phone: work.phone,
        total: 0,
        paid: 0,
        debt: 0,
        items: [],
        lastDate: work.date,
        firstDate: work.date,
        services: {},
      };
    }

    const client = grouped[work.name];
    const amount = work.hours * work.price;
    
    client.items.push(work);
    client.total += amount;

    // حساب المبلغ المدفوع والمتبقي
    if (work.payStatus === 'مقدم') {
      client.paid += amount;
    } else if (work.payStatus === 'نصف') {
      client.paid += amount / 2;
      client.debt += amount / 2;
    } else { // أجل
      client.debt += amount;
    }

    // تحديث التواريخ
    if (work.date > client.lastDate) {
      client.lastDate = work.date;
    }
    if (work.date < client.firstDate) {
      client.firstDate = work.date;
    }

    // تتبع الخدمات
    if (!client.services[work.service]) {
      client.services[work.service] = 0;
    }
    client.services[work.service] += amount;
  });

  return grouped;
}

// حساب إحصائيات الزبائن
export function calculateClientStats(workEntries: WorkEntry[]) {
  const grouped = groupClients(workEntries);
  const clients = Object.values(grouped);

  const totalClients = clients.length;
  const paidClients = clients.filter(client => client.debt === 0).length;
  const debtClients = clients.filter(client => client.debt > 0).length;

  return {
    totalClients,
    paidClients,
    debtClients,
    totalDebt: clients.reduce((sum, client) => sum + client.debt, 0),
    totalPaid: clients.reduce((sum, client) => sum + client.paid, 0),
  };
}

// حساب إحصائيات الخدمات
export function calculateServiceStats(workEntries: WorkEntry[]) {
  const serviceStats: Record<string, {
    count: number;
    amount: number;
    totalHours: number;
    avgPrice: number;
    avgPerJob: number;
  }> = {};

  workEntries.forEach(work => {
    const amount = work.hours * work.price;
    
    if (!serviceStats[work.service]) {
      serviceStats[work.service] = {
        count: 0,
        amount: 0,
        totalHours: 0,
        avgPrice: 0,
        avgPerJob: 0,
      };
    }

    const stats = serviceStats[work.service];
    stats.count++;
    stats.amount += amount;
    stats.totalHours += work.hours;
  });

  // حساب المتوسطات
  Object.keys(serviceStats).forEach(service => {
    const stats = serviceStats[service];
    stats.avgPrice = stats.amount / stats.totalHours;
    stats.avgPerJob = stats.amount / stats.count;
  });

  return serviceStats;
}

// حساب التقرير الشهري
export function calculateMonthlyReport(workEntries: WorkEntry[], expenseEntries: ExpenseEntry[]) {
  const monthlyStats: Record<string, {
    workCount: number;
    income: number;
    expenses: number;
  }> = {};

  // إضافة الأعمال
  workEntries.forEach(work => {
    const month = work.date.substring(0, 7); // YYYY-MM
    const amount = work.hours * work.price;
    
    if (!monthlyStats[month]) {
      monthlyStats[month] = {
        workCount: 0,
        income: 0,
        expenses: 0,
      };
    }

    monthlyStats[month].workCount++;
    monthlyStats[month].income += amount;
  });

  // إضافة المصاريف
  expenseEntries.forEach(exp => {
    const month = exp.date.substring(0, 7);
    
    if (!monthlyStats[month]) {
      monthlyStats[month] = {
        workCount: 0,
        income: 0,
        expenses: 0,
      };
    }

    monthlyStats[month].expenses += exp.amount;
  });

  // تحويل إلى مصفوفة وترتيب
  return Object.entries(monthlyStats)
    .map(([month, stats]) => ({
      month,
      ...stats,
      netProfit: stats.income - stats.expenses,
    }))
    .sort((a, b) => b.month.localeCompare(a.month)); // ترتيب تنازلي حسب الشهر
}

// تنسيق المبالغ
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ar-EG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) + ' جنيه';
}

// تنسيق النسبة المئوية
export function formatPercentage(value: number): string {
  return value.toFixed(1) + '%';
}

// حساب متوسط سعر الساعة
export function calculateAverageHourPrice(workEntries: WorkEntry[]): number {
  if (workEntries.length === 0) return 0;
  const total = workEntries.reduce((sum, work) => sum + work.price, 0);
  return total / workEntries.length;
}

// حساب متوسط الساعات لكل عمل
export function calculateAverageHoursPerJob(workEntries: WorkEntry[]): number {
  if (workEntries.length === 0) return 0;
  const totalHours = workEntries.reduce((sum, work) => sum + work.hours, 0);
  return totalHours / workEntries.length;
}

// الحصول على أفضل الزبائن (حسب المبلغ المدفوع)
export function getTopClients(workEntries: WorkEntry[], limit: number = 5) {
  const grouped = groupClients(workEntries);
  const clients = Object.values(grouped);
  
  return clients
    .sort((a, b) => b.paid - a.paid) // ترتيب حسب المبلغ المدفوع
    .slice(0, limit);
}

// الحصول على أفضل الخدمات (حسب الربحية)
export function getTopServices(workEntries: WorkEntry[], limit: number = 5) {
  const serviceStats = calculateServiceStats(workEntries);
  
  return Object.entries(serviceStats)
    .map(([name, stats]) => ({
      name,
      ...stats,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}
