'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  FaUsers, 
  FaSearch, 
  FaPhone, 
  FaWhatsapp, 
  FaEye, 
  FaEdit,
  FaCalendar,
  FaList,
  FaMoneyBill,
  FaChartBar,
  FaFileExport,
  FaTrash
} from 'react-icons/fa';
import { useData } from '@/hooks/useData';
import { useNotification } from '@/hooks/useNotification';
import Modal from '@/components/Modal';
import { WorkEntry, ClientData } from '@/types';
import { groupClients, calculateClientStats } from '@/utils/calculations';

export default function ClientsSection() {
  const { data, deleteWorkEntry, updateWorkEntry } = useData();
  const { showNotification } = useNotification();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<WorkEntry | null>(null);

  // تجميع بيانات الزبائن - الكود المصحح هنا
  const clients = useMemo(() => {
    const grouped = groupClients(data.work);
    
    // ⭐⭐ الحل: استخدام Object.values بدلاً من Object.keys().map()
    const clientArray = Object.values(grouped)
      .sort((a, b) => new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime());

    // التصفية حسب البحث
    if (searchQuery.trim()) {
      return clientArray.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return clientArray;
  }, [data.work, searchQuery]);

  // إحصائيات الزبائن
  const clientStats = useMemo(() => calculateClientStats(data.work), [data.work]);

  const handleViewDetails = (client: ClientData) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: ClientData) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleCallClient = (phone?: string) => {
    if (phone) {
      window.open(`tel:${phone}`, '_blank');
    } else {
      showNotification('لا يوجد رقم هاتف لهذا الزبون', 'warning');
    }
  };

  const handleWhatsApp = (client: ClientData) => {
    if (!client.phone) {
      showNotification('لا يوجد رقم هاتف لهذا الزبون', 'warning');
      return;
    }

    let message = `*كشف حساب التراكتور*\n\n`;
    message += `*اسم الزبون:* ${client.name}\n`;
    message += `*التاريخ:* ${new Date().toLocaleDateString('ar-SA')}\n`;
    message += `─────────────────\n\n`;
    message += `*سجل الأعمال:*\n`;

    client.items.forEach((item, index) => {
      const amount = item.hours * item.price;
      message += `${index + 1}. ${item.date} - ${item.service} (${item.hours} ساعة) = ${amount} جنيه`;
      if (item.payStatus !== 'مقدم') {
        message += ` (${item.payStatus})`;
      }
      message += `\n`;
    });

    message += `\n─────────────────\n`;
    message += `*الإجمالي:* ${client.total.toLocaleString()} جنيه\n`;
    
    if (client.debt > 0) {
      message += `*المبلغ المتبقي:* ${client.debt.toLocaleString()} جنيه\n`;
      message += `─────────────────\n`;
      message += `*يرجى تسديد المبلغ المتبقي*\n`;
    } else {
      message += `*تم تسديد كامل المبلغ* ✅\n`;
    }

    message += `\nشكراً لتعاملكم معنا 🌾`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${client.phone}?text=${encodedMessage}`, '_blank');
  };

  const handleDeleteWork = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      deleteWorkEntry(id);
      showNotification('تم حذف سجل العمل', 'success');
    }
  };

  const handleUpdatePayment = (id: string, status: 'مقدم' | 'أجل' | 'نصف') => {
    updateWorkEntry(id, { payStatus: status });
    showNotification('تم تحديث حالة الدفع', 'success');
  };

  const handleExportCSV = () => {
    if (data.work.length === 0) {
      showNotification('لا توجد بيانات للتصدير', 'error');
      return;
    }

    let csv = 'اسم الزبون,التاريخ,الخدمة,المكان,الساعات,سعر الساعة,المبلغ,حالة الدفع,الهاتف,الملاحظات\n';
    
    data.work.forEach(work => {
      const amount = work.hours * work.price;
      const row = [
        work.name,
        work.date,
        work.service,
        work.location || '',
        work.hours,
        work.price,
        amount,
        work.payStatus,
        work.phone || '',
        work.notes || ''
      ].map(field => `"${field}"`).join(',');
      
      csv += row + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tractor_clients_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('تم تصدير البيانات كملف Excel', 'success');
  };

  return (
    <div className="space-y-8">
      {/* رأس الصفحة */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaUsers className="text-purple-600 mr-3 text-2xl" />
            سجل الزبائن
          </h3>
          
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 بحث باسم الزبون..."
                className="input-field pr-12"
              />
              <FaSearch className="absolute left-4 top-4 text-gray-400" />
            </div>
            <button
              onClick={handleExportCSV}
              className="btn-primary px-6"
            >
              <FaFileExport className="inline-block ml-2" />
              تصدير
            </button>
          </div>
        </div>

        {/* إحصائيات الزبائن */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200">
            <div className="text-blue-700 text-lg mb-2">إجمالي الزبائن</div>
            <div className="text-4xl font-bold text-blue-800">
              {clientStats.totalClients}
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
            <div className="text-green-700 text-lg mb-2">زبائن سددوا كامل المبلغ</div>
            <div className="text-4xl font-bold text-green-800">
              {clientStats.paidClients}
            </div>
          </div>
          
          <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
            <div className="text-red-700 text-lg mb-2">زبائن مدينين</div>
            <div className="text-4xl font-bold text-red-800">
              {clientStats.debtClients}
            </div>
          </div>
        </div>

        {/* قائمة الزبائن */}
        {clients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FaUsers className="text-4xl mb-4 mx-auto" />
            <p className="text-lg">
              {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد عملاء مسجلين بعد'}
            </p>
            {searchQuery && (
              <p className="text-sm mt-2">جرب البحث باسم آخر</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {clients.map(client => {
              const paymentRate = client.total > 0 
                ? Math.round((client.paid / client.total) * 100) 
                : 0;
              
              const topService = Object.entries(client.services)
                .sort((a, b) => b[1] - a[1])[0] || ['لا توجد', 0];

              return (
                <div
                  key={client.name}
                  className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-primary-500 transition-all duration-300 hover:shadow-xl"
                >
                  {/* رأس البطاقة */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">
                          {client.name}
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {client.phone && (
                            <div className="flex items-center text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                              <FaPhone className="ml-2 text-blue-500" />
                              {client.phone}
                            </div>
                          )}
                          <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                            <FaCalendar className="ml-2 text-gray-500" />
                            أول معاملة: {client.firstDate}
                          </div>
                          <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                            <FaList className="ml-2 text-gray-500" />
                            عدد المعاملات: {client.items.length}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {client.phone && (
                          <>
                            <button
                              onClick={() => handleCallClient(client.phone)}
                              className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-xl transition-all duration-300 hover:scale-110"
                              title="اتصال هاتفي"
                            >
                              <FaPhone />
                            </button>
                            <button
                              onClick={() => handleWhatsApp(client)}
                              className="bg-green-100 hover:bg-green-200 text-green-700 p-3 rounded-xl transition-all duration-300 hover:scale-110"
                              title="واتساب"
                            >
                              <FaWhatsapp />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleViewDetails(client)}
                          className="bg-purple-100 hover:bg-purple-200 text-purple-700 p-3 rounded-xl transition-all duration-300 hover:scale-110"
                          title="عرض التفاصيل"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEditClient(client)}
                          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-3 rounded-xl transition-all duration-300 hover:scale-110"
                          title="تعديل البيانات"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* جسم البطاقة */}
                  <div className="p-6">
                    {/* الإحصائيات المالية */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className="text-gray-600 text-sm mb-2">إجمالي المبلغ</div>
                        <div className="text-3xl font-bold text-gray-800">
                          {client.total.toLocaleString()}
                        </div>
                        <div className="text-gray-500 text-xs">جنيه</div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-xl">
                        <div className="text-green-600 text-sm mb-2">المبلغ المدفوع</div>
                        <div className="text-3xl font-bold text-green-700">
                          {client.paid.toLocaleString()}
                        </div>
                        <div className="text-green-500 text-xs">
                          {paymentRate}% من الإجمالي
                        </div>
                      </div>
                      
                      <div className={`text-center p-4 rounded-xl ${
                        client.debt > 0 ? 'bg-red-50' : 'bg-green-100'
                      }`}>
                        <div className={`text-sm mb-2 ${
                          client.debt > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          المبلغ المتبقي
                        </div>
                        <div className={`text-3xl font-bold ${
                          client.debt > 0 ? 'text-red-700' : 'text-green-700'
                        }`}>
                          {client.debt.toLocaleString()}
                        </div>
                        <div className={`text-xs ${
                          client.debt > 0 ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {client.debt > 0 ? 'غير مدفوع' : 'مدفوع بالكامل ✓'}
                        </div>
                      </div>
                    </div>

                    {/* شريط التقدم */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>معدل الدفع</span>
                        <span>{paymentRate}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill bg-green-500"
                          style={{ width: `${paymentRate}%` }}
                        />
                      </div>
                    </div>

                    {/* معلومات إضافية */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="text-blue-600 text-sm mb-1">الخدمة الرئيسية</div>
                        <div className="text-xl font-bold text-blue-700">
                          {topService[0]}
                        </div>
                        <div className="text-blue-500 text-xs">
                          {topService[1].toLocaleString()} جنيه
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-xl">
                        <div className="text-purple-600 text-sm mb-1">آخر الخدمات</div>
                        <div className="flex flex-wrap gap-2">
                          {client.items.slice(-3).reverse().map((item, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                            >
                              {item.service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* نافذة تفاصيل الزبون */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`تفاصيل الزبون: ${selectedClient?.name || ''}`}
        size="xl"
      >
        {selectedClient && (
          <div className="space-y-6">
            {/* الإحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-blue-700 text-sm">إجمالي المبلغ</div>
                <div className="text-2xl font-bold text-blue-800">
                  {selectedClient.total.toLocaleString()}
                </div>
                <div className="text-blue-600 text-xs">جنيه</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="text-green-700 text-sm">المبلغ المدفوع</div>
                <div className="text-2xl font-bold text-green-800">
                  {selectedClient.paid.toLocaleString()}
                </div>
                <div className="text-green-600 text-xs">جنيه</div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-xl">
                <div className="text-red-700 text-sm">المبلغ المتبقي</div>
                <div className="text-2xl font-bold text-red-800">
                  {selectedClient.debt.toLocaleString()}
                </div>
                <div className="text-red-600 text-xs">جنيه</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="text-purple-700 text-sm">عدد المعاملات</div>
                <div className="text-2xl font-bold text-purple-800">
                  {selectedClient.items.length}
                </div>
                <div className="text-purple-600 text-xs">عملية</div>
              </div>
            </div>

            {/* معلومات الاتصال */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-bold text-gray-700 text-lg">معلومات الاتصال</h5>
                {selectedClient.phone && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCallClient(selectedClient.phone)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <FaPhone className="ml-2" />
                      اتصال
                    </button>
                    <button
                      onClick={() => handleWhatsApp(selectedClient)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <FaWhatsapp className="ml-2" />
                      واتساب
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p><span className="font-semibold">الهاتف:</span> {selectedClient.phone || 'غير متوفر'}</p>
                <p><span className="font-semibold">أول معاملة:</span> {selectedClient.firstDate}</p>
                <p><span className="font-semibold">آخر معاملة:</span> {selectedClient.lastDate}</p>
              </div>
            </div>

            {/* جدول المعاملات */}
            <div>
              <h5 className="font-bold text-gray-700 text-lg mb-4">سجل المعاملات</h5>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-right">التاريخ</th>
                      <th className="px-4 py-3 text-right">الخدمة</th>
                      <th className="px-4 py-3 text-right">المكان</th>
                      <th className="px-4 py-3 text-right">الساعات</th>
                      <th className="px-4 py-3 text-right">سعر الساعة</th>
                      <th className="px-4 py-3 text-right">المبلغ</th>
                      <th className="px-4 py-3 text-right">الحالة</th>
                      <th className="px-4 py-3 text-right">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClient.items.map((work) => {
                      const amount = work.hours * work.price;
                      const statusColor = work.payStatus === 'أجل' 
                        ? 'bg-red-100 text-red-800' 
                        : work.payStatus === 'نصف' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800';
                      
                      return (
                        <tr key={work.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{work.date}</td>
                          <td className="px-4 py-3">{work.service}</td>
                          <td className="px-4 py-3">{work.location || '-'}</td>
                          <td className="px-4 py-3">{work.hours}</td>
                          <td className="px-4 py-3">{work.price.toLocaleString()}</td>
                          <td className="px-4 py-3 font-bold">{amount.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-sm ${statusColor}`}>
                              {work.payStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdatePayment(work.id, 'مقدم')}
                                className={`text-green-600 hover:text-green-800 ${
                                  work.payStatus === 'مقدم' ? 'hidden' : ''
                                }`}
                                title="تسديد كامل"
                              >
                                <FaMoneyBill />
                              </button>
                              <button
                                onClick={() => handleDeleteWork(work.id)}
                                className="text-red-600 hover:text-red-800"
                                title="حذف"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* نافذة تعديل الزبون */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`تعديل بيانات الزبون: ${selectedClient?.name || ''}`}
        size="lg"
      >
        {selectedClient && (
          <div className="space-y-6">
            <div>
              <h5 className="font-bold text-gray-700 text-lg mb-4">تحديث بيانات التواصل</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">اسم الزبون</label>
                  <input
                    type="text"
                    defaultValue={selectedClient.name}
                    className="input-field"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    defaultValue={selectedClient.phone || ''}
                    placeholder="أدخل رقم هاتف جديد"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-gray-700 text-lg mb-4">
                سجلات العمل ({selectedClient.items.length} سجل)
              </h5>
              <div className="space-y-3 max-h-[300px] overflow-y-auto p-3 bg-gray-50 rounded-xl">
                {selectedClient.items.map((work) => (
                  <div key={work.id} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="font-medium">{work.date}</span>
                        <span className="text-gray-600 mr-2"> - {work.service}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingWork(work);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="تعديل"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleUpdatePayment(work.id, 'مقدم')}
                          className={`text-green-600 hover:text-green-800 ${
                            work.payStatus === 'مقدم' ? 'hidden' : ''
                          }`}
                          title="تسديد كامل"
                        >
                          <FaMoneyBill />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {work.hours} ساعة × {work.price.toLocaleString()} جنيه = 
                      <span className="font-bold mr-2"> {(work.hours * work.price).toLocaleString()}</span> جنيه
                      <span className="mx-2">|</span>
                      الحالة: 
                      <span className={`mr-2 ${
                        work.payStatus === 'مقدم' ? 'text-green-600' :
                        work.payStatus === 'نصف' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {work.payStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  showNotification('تم تحديث بيانات الزبون', 'success');
                  setIsEditModalOpen(false);
                }}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                حفظ التعديلات
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
