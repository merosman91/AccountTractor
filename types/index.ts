export interface WorkEntry {
  id: string;
  name: string;
  date: string;
  location: string;
  service: string;
  hours: number;
  price: number;
  payStatus: 'مقدم' | 'أجل' | 'نصف';
  phone?: string;
  notes?: string;
  timestamp: string;
}

export interface ExpenseEntry {
  id: string;
  date: string;
  type: string;
  amount: number;
  details?: string;
  timestamp: string;
}

export interface ClientData {
  name: string;
  phone?: string;
  total: number;
  paid: number;
  debt: number;
  items: WorkEntry[];
  lastDate: string;
  firstDate: string;
  services: Record<string, number>;
}

export interface AppData {
  work: WorkEntry[];
  expenses: ExpenseEntry[];
}

export interface ServiceStats {
  name: string;
  count: number;
  amount: number;
  totalHours: number;
  avgPrice: number;
  avgPerJob: number;
}

export interface ReportData {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  totalJobs: number;
  totalHours: number;
  avgHourPrice: number;
  avgHoursPerJob: number;
  serviceStats: ServiceStats[];
  clientStats: ClientData[];
  monthlyStats: Array<{
    month: string;
    workCount: number;
    income: number;
    expenses: number;
    netProfit: number;
  }>;
}
