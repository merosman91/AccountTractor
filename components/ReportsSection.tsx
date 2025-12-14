'use client';

import { useState, useMemo } from 'react';
import { 
  FaChartBar, 
  FaChartLine, 
  FaChartPie, 
  FaTrophy, 
  FaUsers,
  FaTractor,
  FaMoneyBillWave,
  FaCalendar,
  FaFileAlt,
  FaArrowUp,
  FaArrowDown,
  FaCrown
} from 'react-icons/fa';
import { useData } from '@/hooks/useData';
import { 
  calculateStats, 
  calculateServiceStats, 
  calculateMonthlyReport,
  getTopClients,
  getTopServices,
  formatCurrency,
  formatPercentage
} from '@/utils/calculations';

type ReportType = 'general' | 'work' | 'clients' | 'services';

export default function ReportsSection() {
  const { data } = useData();
  const [activeReport, setActiveReport] = useState<ReportType>('general');

  // حساب جميع الإحصائيات
  const stats = useMemo(() => calculateStats(data), [data]);
  const serviceStats = useMemo(() => calculateServiceStats(data.work), [data.work]);
  const monthlyReport = useMemo(() => calculateMonthlyReport(data.work, data.expenses), [data.work, data.expenses]);
  const topClients = useMemo(() => getTopClients(data.work, 5), [data.work]);
  const topServices = useMemo(() => getTopServices(data.work, 5), [data.work]);

  // إحصائيات حالة الدفع
  const paymentStats = useMemo(() => {
    const stats = { مقدم: 0, أجل: 0, نصف: 0 };
    data.work.forEach(work => {
      stats[work.payStatus]++;
    });
    return stats;
  }, [data.work]);

  const renderGeneralReport = () => (
    <div className="space-y-8">
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FaMoneyBillWave className="text-3xl" />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">الدخل</span>
          </div>
          <div className="text-3xl font-bold mb-2">{formatCurrency(stats.totalIncome)}</div>
          <div className="text-blue-100">إجمالي الدخل</div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FaChartLine className="text-3xl" />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">الربح</span>
          </div>
          <div className="text-3xl font-bold mb-2">{formatCurrency(stats.netProfit)}</div>
          <div className="text-green-100">صافي الربح</div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FaMoneyBillWave className="text-3xl" />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">المصاريف</span>
          </div>
          <div className="text-3xl font-bold mb-2">{formatCurrency(stats.totalExpenses)}</div>
          <div className="text-red-100">إجمالي المصاريف</div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FaFileAlt className="text-3xl" />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">الأعمال</span>
          </div>
          <div className="text-3xl font-bold mb-2">{stats.totalJobs}</div>
          <div className="text-purple-100">إجمالي الأعمال</div>
        </div>
      </div>

      {/* المزيد من الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FaChartPie className="text-blue-600 mr-2" />
            توزيع حالة الدفع
          </h4>
          <div className="space-y-3">
            {Object.entries(paymentStats).map(([status, count]) => {
              const percentage = stats.totalJobs > 0 ? (count / stats.totalJobs * 100).toFixed(1) : '0';
              const color = status === 'مقدم' ? 'bg-green-500' : 
                           status === 'نصف' ? 'bg-yellow-500' : 'bg-red-500';
              const textColor = status === 'مقدم' ? 'text-green-700' : 
                              status === 'نصف' ? 'text-yellow-700' : 'text-red-700';
              
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className={`font-medium ${textColor}`}>
                      {status === 'مقدم' ? 'خالص' : 
                       status === 'نصف' ? 'نصف المبلغ' : 'أجل (دين)'}
                    </span>
                    <span className="text-gray-600">{count} عمل ({percentage}%)</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FaCalendar className="text-green-600 mr-2" />
            الأداء الشهري
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {monthlyReport.slice(0, 6).map((month) => (
              <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{formatMonth(month.month)}</div>
                  <div className="text-sm text-gray-500">{month.workCount} عمل</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary-600">
                    {formatCurrency(month.netProfit)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {month.netProfit >= 0 ? 
                      <span className="text-green-600 flex items-center">
                        <FaArrowUp className="ml-1" /> ربح
                      </span> : 
                      <span className="text-red-600 flex items-center">
                        <FaArrowDown className="ml-1" /> خسارة
                      </span>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FaTractor className="text-purple-600 mr-2" />
            معدلات الأداء
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="text-blue-700">متوسط سعر الساعة</div>
              <div className="text-xl font-bold text-blue-800">
                {serviceStats[Object.keys(serviceStats)[0]]?.avgPrice.toFixed(0) || 0} ج
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="text-green-700">متوسط الساعات/عمل</div>
              <div className="text-xl font-bold text-green-800">
                {stats.totalJobs > 0 ? 
                  (data.work.reduce((sum, w) => sum + w.hours, 0) / stats.totalJobs).toFixed(1) : 0
                } ساعة
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div className="text-purple-700">متوسط الدخل/عمل</div>
              <div className="text-xl font-bold text-purple-800">
                {stats.totalJobs > 0 ? 
                  formatCurrency(stats.totalIncome / stats.totalJobs) : 
                  formatCurrency(0)
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* تقرير مفصل */}
      <div className="card">
        <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <FaFileAlt className="text-primary-600 mr-3" />
          تقرير مفصل للأداء
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-right">المؤشر</th>
                <th className="px-4 py-3 text-right">القيمة</th>
                <th className="px-4 py-3 text-right">النسبة</th>
                <th className="px-4 py-3 text-right">التقييم</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">معدل الربحية</td>
                <td className="px-4 py-3">{formatCurrency(stats.netProfit)}</td>
                <td className="px-4 py-3">
                  {stats.totalIncome > 0 ? 
                    formatPercentage((stats.netProfit / stats.totalIncome) * 100) : 
                    '0%'
                  }
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    stats.netProfit >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stats.netProfit >= 0 ? 'جيد ✓' : 'تحتاج تحسين'}
                  </span>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">كفاءة التكاليف</td>
                <td className="px-4 py-3">{formatCurrency(stats.totalExpenses)}</td>
                <td className="px-4 py-3">
                  {stats.totalIncome > 0 ? 
                    formatPercentage((stats.totalExpenses / stats.totalIncome) * 100) : 
                    '0%'
                  }
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    (stats.totalExpenses / stats.totalIncome) < 0.3 ? 'bg-green-100 text-green-800' :
                    (stats.totalExpenses / stats.totalIncome) < 0.5 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {(stats.totalExpenses / stats.totalIncome) < 0.3 ? 'ممتاز' :
                     (stats.totalExpenses / stats.totalIncome) < 0.5 ? 'جيد' :
                     'مرتفع'}
                  </span>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">نسبة الأعمال المسددة</td>
                <td className="px-4 py-3">{paymentStats['مقدم']} عمل</td>
                <td className="px-4 py-3">
                  {stats.totalJobs > 0 ? 
                    formatPercentage((paymentStats['مقدم'] / stats.totalJobs) * 100) : 
                    '0%'
                  }
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    (paymentStats['مقدم'] / stats.totalJobs) >= 0.8 ? 'bg-green-100 text-green-800' :
                    (paymentStats['مقدم'] / stats.totalJobs) >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {(paymentStats['مقدم'] / stats.totalJobs) >= 0.8 ? 'ممتاز' :
                     (paymentStats['مقدم'] / stats.totalJobs) >= 0.6 ? 'جيد' :
                     'تحتاج متابعة'}
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">عدد الزبائن النشطين</td>
                <td className="px-4 py-3">{topClients.length}</td>
                <td className="px-4 py-3">
                  {topClients.length >= 10 ? 'عالية' :
                   topClients.length >= 5 ? 'متوسطة' : 'منخفضة'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    topClients.length >= 10 ? 'bg-green-100 text-green-800' :
                    topClients.length >= 5 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {topClients.length >= 10 ? 'متنوع' :
                     topClients.length >= 5 ? 'جيد' : 'بحاجة لزيادة'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderWorkReport = () => (
    <div className="space-y-8">
      {/* إحصائيات الأعمال */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h4 className="text-lg font-bold text-gray-800 mb-4">تفاصيل الأعمال</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="text-blue-700">إجمالي الأعمال</div>
              <div className="text-2xl font-bold text-blue-800">{stats.totalJobs}</div>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="text-green-700">إجمالي الساعات</div>
              <div className="text-2xl font-bold text-green-800">
                {data.work.reduce((sum, w) => sum + w.hours, 0).toFixed(1)}
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div className="text-purple-700">متوسط الساعات/عمل</div>
              <div className="text-2xl font-bold text-purple-800">
                {stats.totalJobs > 0 ? 
                  (data.work.reduce((sum, w) => sum + w.hours, 0) / stats.totalJobs).toFixed(1) : 0
                }
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h4 className="text-lg font-bold text-gray-800 mb-4">توزيع الخدمات</h4>
          <div className="space-y-3">
            {Object.entries(serviceStats)
              .sort((a, b) => b[1].count - a[1].count)
              .slice(0, 5)
              .map(([service, stats], index) => (
                <div key={service} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-medium">{service}</div>
                      <div className="text-sm text-gray-500">{stats.count} عمل</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary-600">
                      {formatCurrency(stats.amount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatPercentage((stats.amount / calculateStats(data).totalIncome) * 100)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="card">
          <h4 className="text-lg font-bold text-gray-800 mb-4">أعلى 5 أعمال ربحية</h4>
          <div className="space-y-3">
            {data.work
              .sort((a, b) => (b.hours * b.price) - (a.hours * a.price))
              .slice(0, 5)
              .map((work, index) => (
                <div key={work.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-700 ml-3">{index + 1}</span>
                    <div>
                      <div className="font-medium">{work.name}</div>
                      <div className="text-sm text-gray-500">{work.date} - {work.service}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      {formatCurrency(work.hours * work.price)}
                    </div>
                    <div className="text-sm text-gray-500">{work.hours} ساعة</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* جدول الأعمال */}
      <div className="card">
        <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <FaFileAlt className="text-primary-600 mr-3" />
          سجل الأعمال الكامل
        </h4>
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-right">#</th>
                <th className="px-4 py-3 text-right">الزبون</th>
                <th className="px-4 py-3 text-right">التاريخ</th>
                <th className="px-4 py-3 text-right">الخدمة</th>
                <th className="px-4 py-3 text-right">الساعات</th>
                <th className="px-4 py-3 text-right">سعر الساعة</th>
                <th className="px-4 py-3 text-right">المبلغ</th>
                <th className="px-4 py-3 text-right">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {data.work
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((work, index) => (
                  <tr key={work.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{work.name}</td>
                    <td className="px-4 py-3">{work.date}</td>
                    <td className="px-4 py-3">{work.service}</td>
                    <td className="px-4 py-3">{work.hours}</td>
                    <td className="px-4 py-3">{work.price.toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-primary-600">
                      {formatCurrency(work.hours * work.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        work.payStatus === 'مقدم' ? 'bg-green-100 text-green-800' :
                        work.payStatus === 'نصف' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {work.payStatus}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderClientsReport = () => (
    <div className="space-y-8">
      {/* أفضل الزبائن */}
      <div className="card">
        <h4 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FaTrophy className="text-yellow-600 mr-3" />
          أفضل 5 زبائن (حسب المبلغ المدفوع)
        </h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-right">الترتيب</th>
                <th className="px-4 py-3 text-right">اسم الزبون</th>
                <th className="px-4 py-3 text-right">عدد المعاملات</th>
                <th className="px-4 py-3 text-right">إجمالي المبلغ</th>
                <th className="px-4 py-3 text-right">المبلغ المدفوع</th>
                <th className="px-4 py-3 text-right">المبلغ المتبقي</th>
                <th className="px-4 py-3 text-right">نسبة الدفع</th>
                <th className="px-4 py-3 text-right">التقييم</th>
              </tr>
            </thead>
            <tbody>
              {topClients.map((client, index) => {
                const paymentRate = client.total > 0 ? (client.paid / client.total) * 100 : 0;
                
                return (
                  <tr key={client.name} className={`border-b hover:bg-gray-50 ${
                    index < 3 ? 'bg-yellow-50' : ''
                  }`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        {index === 0 ? (
                          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 flex items-center">
                            <FaCrown className="ml-1" /> الأول
                          </span>
                        ) : index === 1 ? (
                          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                            الثاني
                          </span>
                        ) : index === 2 ? (
                          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800">
                            الثالث
                          </span>
                        ) : (
                          <span className="text-gray-600">{index + 1}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {client.name}
                      {client.phone && (
                        <div className="text-sm text-gray-500">{client.phone}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">{client.items.length}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">
                      {formatCurrency(client.total)}
                    </td>
                    <td className="px-4 py-3 font-bold text-green-600">
                      {formatCurrency(client.paid)}
                    </td>
                    <td className="px-4 py-3 font-bold text-red-600">
                      {formatCurrency(client.debt)}
                    </td>
                    <td className="px-4 py-3 font-bold">
                      <span className={
                        paymentRate >= 100 ? 'text-green-600' :
                        paymentRate >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }>
                        {paymentRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        paymentRate >= 100 ? 'bg-green-100 text-green-800' :
                        paymentRate >= 80 ? 'bg-blue-100 text-blue-800' :
                        paymentRate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {paymentRate >= 100 ? 'ممتاز ✓' :
                         paymentRate >= 80 ? 'جيد جداً' :
                         paymentRate >= 50 ? 'متوسط' :
                         'بحاجة متابعة'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* إحصائيات الزبائن */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="text-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl">
            <div className="text-2xl font-bold mb-2">
              {topClients.filter(c => c.debt === 0).length}
            </div>
            <div className="text-green-100">زبائن سددوا كامل المبلغ</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl">
            <div className="text-2xl font-bold mb-2">
              {formatCurrency(topClients.reduce((sum, client) => sum + client.paid, 0))}
            </div>
            <div className="text-blue-100">إجمالي المبالغ المدفوعة</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl">
            <div className="text-2xl font-bold mb-2">
              {formatCurrency(topClients.reduce((sum, client) => sum + client.debt, 0))}
            </div>
            <div className="text-red-100">إجمالي المبالغ المتبقية</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl">
            <div className="text-2xl font-bold mb-2">
              {topClients.length}
            </div>
            <div className="text-purple-100">إجمالي الزبائن النشطين</div>
          </div>
        </div>
      </div>

      {/* توزيع الزبائن */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h4 className="text-lg font-bold text-gray-800 mb-4">توزيع الزبائن حسب المبلغ</h4>
          <div className="space-y-3">
            {topClients.map((client, index) => {
              const percentage = (client.total / calculateStats(data).totalIncome * 100);
              return (
                <div key={client.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{client.name}</span>
                    <span className="text-gray-600">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-500' :
                        index === 2 ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h4 className="text-lg font-bold text-gray-800 mb-4">مؤشرات ولاء الزبائن</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="text-blue-700">متوسط المعاملات/زبون</div>
              <div className="text-xl font-bold text-blue-800">
                {topClients.length > 0 ? 
                  (topClients.reduce((sum, c) => sum + c.items.length, 0) / topClients.length).toFixed(1) : 
                  0
                }
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="text-green-700">متوسط المبلغ/زبون</div>
              <div className="text-xl font-bold text-green-800">
                {topClients.length > 0 ? 
                  formatCurrency(topClients.reduce((sum, c) => sum + c.total, 0) / topClients.length) : 
                  formatCurrency(0)
                }
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div className="text-purple-700">نسبة الزبائن الممتازين</div>
              <div className="text-xl font-bold text-purple-800">
                {topClients.length > 0 ? 
                  ((topClients.filter(c => (c.paid / c.total) >= 0.8).length / topClients.length) * 100).toFixed(1) + '%' : 
                  '0%'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServicesReport = () => (
    <div className="space-y-8">
      {/* أفضل الخدمات */}
      <div className="card">
        <h4 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FaTractor className="text-primary-600 mr-3" />
          أفضل 5 خدمات (حسب الربحية)
        </h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-right">الخدمة</th>
                <th className="px-4 py-3 text-right">عدد الأعمال</th>
                <th className="px-4 py-3 text-right">إجمالي الساعات</th>
                <th className="px-4 py-3 text-right">متوسط سعر الساعة</th>
                <th className="px-4 py-3 text-right">متوسط دخل/عمل</th>
                <th className="px-4 py-3 text-right">إجمالي الدخل</th>
                <th className="px-4 py-3 text-right">النسبة</th>
              </tr>
            </thead>
            <tbody>
              {topServices.map((service, index) => (
                <tr key={service.name} className={`border-b hover:bg-gray-50 ${
                  index === 0 ? 'bg-green-50' : ''
                }`}>
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center">
                      {index === 0 && <FaCrown className="text-yellow-500 ml-2" />}
                      {service.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{service.count}</td>
                  <td className="px-4 py-3">{service.totalHours.toFixed(1)}</td>
                  <td className="px-4 py-3 font-bold text-blue-600">
                    {service.avgPrice.toFixed(0)} ج
                  </td>
                  <td className="px-4 py-3 font-bold text-green-600">
                    {service.avgPerJob.toFixed(0)} ج
                  </td>
                  <td className="px-4 py-3 font-bold text-primary-600">
                    {formatCurrency(service.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 ml-3">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ 
                            width: `${(service.amount / calculateStats(data).totalIncome * 100).toFixed(1)}%` 
                          }}
                        />
                      </div>
                      <span className="font-bold">
                        {(service.amount / calculateStats(data).totalIncome * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* إحصائيات الخدمات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="text-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl">
            <div className="text-2xl font-bold mb-2">{topServices.length}</div>
            <div className="text-purple-100">عدد أنواع الخدمات</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl">
            <div className="text-2xl font-bold mb-2">{topServices[0]?.name || 'لا توجد'}</div>
            <div className="text-green-100">الخدمة الأعلى ربحاً</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl">
            <div className="text-2xl font-bold mb-2">
              {topServices[0]?.amount ? formatCurrency(topServices[0].amount) : formatCurrency(0)}
            </div>
            <div className="text-blue-100">دخل الخدمة الأولى</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl">
            <div className="text-2xl font-bold mb-2">
              {topServices.length > 0 ? 
                ((topServices[0].amount / calculateStats(data).totalIncome) * 100).toFixed(1) + '%' : 
                '0%'
              }
            </div>
            <div className="text-yellow-100">حصة الخدمة الأولى</div>
          </div>
        </div>
      </div>

      {/* تحليل الربحية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h4 className="text-lg font-bold text-gray-800 mb-4">مقارنة ربحية الخدمات</h4>
          <div className="space-y-4">
            {topServices.map((service) => {
              const percentage = (service.amount / calculateStats(data).totalIncome) * 100;
              const profitPerHour = service.amount / service.totalHours;
              
              return (
                <div key={service.name} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{service.name}</div>
                    <div className="text-primary-600 font-bold">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>ربحية الساعة:</span>
                      <span className="font-medium">{profitPerHour.toFixed(0)} ج/ساعة</span>
                    </div>
                    <div className="flex justify-between">
                      <span>متوسط العمل:</span>
                      <span className="font-medium">{service.avgPerJob.toFixed(0)} ج</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h4 className="text-lg font-bold text-gray-800 mb-4">توصيات للتحسين</h4>
          <div className="space-y-4">
            {(() => {
              const recommendations = [];
              
              // تحليل الخدمات
              const avgProfitPerHour = calculateStats(data).totalIncome / 
                data.work.reduce((sum, w) => sum + w.hours, 0);
              
              topServices.forEach((service, index) => {
                const profitPerHour = service.amount / service.totalHours;
                const diff = profitPerHour - avgProfitPerHour;
                
                if (diff > 0 && index === 0) {
                  recommendations.push({
                    type: 'success',
                    message: `خدمة "${service.name}" هي الأكثر ربحية، يمكنك التركيز عليها`,
                  });
                } else if (diff < 0 && index === topServices.length - 1) {
                  recommendations.push({
                    type: 'warning',
                    message: `خدمة "${service.name}" أقل ربحية، يمكنك تحسين أسعارها`,
                  });
                }
              });

              // اقتراحات عامة
              if (topServices.length < 3) {
                recommendations.push({
                  type: 'info',
                  message: 'يمكنك إضافة أنواع خدمات جديدة لزيادة التنوع',
                });
              }

              return recommendations.map((rec, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${
                  rec.type === 'success' ? 'bg-green-50 border border-green-200' :
                  rec.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  <div className="font-medium mb-1">
                    {rec.type === 'success' ? 'نقاط قوة:' :
                     rec.type === 'warning' ? 'فرص للتحسين:' :
                     'اقتراح:'}
                  </div>
                  <div className="text-sm text-gray-700">{rec.message}</div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="space-y-8">
      {/* أزرار اختيار التقرير */}
      <div className="card">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveReport('general')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeReport === 'general'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaChartBar className="inline-block ml-2" />
            التقرير العام
          </button>
          <button
            onClick={() => setActiveReport('work')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeReport === 'work'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaFileAlt className="inline-block ml-2" />
            تقرير الأعمال
          </button>
          <button
            onClick={() => setActiveReport('clients')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeReport === 'clients'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaUsers className="inline-block ml-2" />
            تقرير الزبائن
          </button>
          <button
            onClick={() => setActiveReport('services')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeReport === 'services'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaTractor className="inline-block ml-2" />
            تقرير الخدمات
          </button>
        </div>

        {/* عرض التقرير المحدد */}
        <div className="animate-fade-in">
          {activeReport === 'general' && renderGeneralReport()}
          {activeReport === 'work' && renderWorkReport()}
          {activeReport === 'clients' && renderClientsReport()}
          {activeReport === 'services' && renderServicesReport()}
        </div>
      </div>
    </div>
  );
}
