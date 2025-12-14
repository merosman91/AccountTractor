'use client';

import { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaCalendar, 
  FaMapMarkerAlt, 
  FaCogs, 
  FaClock,
  FaTag,
  FaMoneyCheckAlt,
  FaMoneyBill,
  FaPhone,
  FaStickyNote,
  FaSave,
  FaHistory
} from 'react-icons/fa';
import { useData } from '@/hooks/useData';
import { useNotification } from '@/hooks/useNotification';
import { WorkEntry } from '@/types';

const SERVICE_TYPES = ['حراثة', 'قصابية', 'نقل', 'تنعيم', 'دقاقة', 'أخرى'];
const PAYMENT_STATUSES = [
  { value: 'مقدم', label: 'خالص' },
  { value: 'أجل', label: 'أجل (دين)' },
  { value: 'نصف', label: 'نصف المبلغ' },
];

export default function WorkSection() {
  const { data, addWorkEntry } = useData();
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState<Partial<WorkEntry>>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    service: SERVICE_TYPES[0],
    hours: 0,
    price: 0,
    payStatus: 'مقدم',
    phone: '',
    notes: '',
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [recentWork, setRecentWork] = useState<WorkEntry[]>([]);

  useEffect(() => {
    setRecentWork(data.work.slice(-5).reverse());
  }, [data.work]);

  useEffect(() => {
    const total = (formData.hours || 0) * (formData.price || 0);
    setTotalAmount(total);
  }, [formData.hours, formData.price]);

  const handleInputChange = (field: keyof WorkEntry, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || formData.name.length < 2) {
      showNotification('يرجى إدخال اسم الزبون', 'error');
      return;
    }

    if (!formData.hours || formData.hours <= 0) {
      showNotification('يرجى إدخال عدد ساعات صحيح', 'error');
      return;
    }

    if (!formData.price || formData.price <= 0) {
      showNotification('يرجى إدخال سعر ساعة صحيح', 'error');
      return;
    }

    const newEntry: WorkEntry = {
      id: Date.now().toString(),
      name: formData.name,
      date: formData.date || new Date().toISOString().split('T')[0],
      location: formData.location || '',
      service: formData.service || SERVICE_TYPES[0],
      hours: formData.hours || 0,
      price: formData.price || 0,
      payStatus: formData.payStatus || 'مقدم',
      phone: formData.phone,
      notes: formData.notes,
      timestamp: new Date().toISOString(),
    };

    addWorkEntry(newEntry);
    
    // إعادة تعيين النموذج
    setFormData({
      name: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      service: SERVICE_TYPES[0],
      hours: 0,
      price: 0,
      payStatus: 'مقدم',
      phone: '',
      notes: '',
    });

    showNotification('تم حفظ يوم العمل بنجاح!', 'success');
  };

  const uniqueNames = Array.from(new Set(data.work.map(w => w.name)));

  return (
    <div className="space-y-8">
      {/* نموذج تسجيل العمل */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FaSave className="text-primary-600 mr-3 text-2xl" />
          تسجيل يوم عمل جديد
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* اسم الزبون */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
              <FaUser className="mr-2" />
              اسم الزبون
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="ابحث أو أضف اسم جديد"
              list="namesList"
              className="input-field"
            />
            <datalist id="namesList">
              {uniqueNames.map(name => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>

          {/* التاريخ */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
              <FaCalendar className="mr-2" />
              التاريخ
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="input-field"
            />
          </div>

          {/* المكان */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              المكان
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="المزرعة / المنطقة"
              className="input-field"
            />
          </div>

          {/* نوع الخدمة */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
              <FaCogs className="mr-2" />
              نوع الخدمة
            </label>
            <select
              value={formData.service}
              onChange={(e) => handleInputChange('service', e.target.value)}
              className="input-field"
            >
              {SERVICE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* عدد الساعات */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
              <FaClock className="mr-2" />
              عدد الساعات
            </label>
            <input
              type="number"
              value={formData.hours || ''}
              onChange={(e) => handleInputChange('hours', parseFloat(e.target.value) || 0)}
              step="0.5"
              min="0.5"
              max="24"
              className="input-field"
            />
          </div>

          {/* سعر الساعة */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
              <FaTag className="mr-2" />
              سعر الساعة (جنيه)
            </label>
            <input
              type="number"
              value={formData.price || ''}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              min="0"
              className="input-field"
            />
          </div>

          {/* حالة الدفع */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
              <FaMoneyCheckAlt className="mr-2" />
              حالة الدفع
            </label>
            <select
              value={formData.payStatus}
              onChange={(e) => handleInputChange('payStatus', e.target.value)}
              className="input-field"
            >
              {PAYMENT_STATUSES.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* المبلغ الإجمالي */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
              <FaMoneyBill className="mr-2" />
              المبلغ الإجمالي
            </label>
            <input
              type="text"
              value={totalAmount.toLocaleString()}
              readOnly
              className="input-field bg-gray-100 font-bold text-primary-600 text-center"
            />
          </div>
        </div>

        {/* هاتف الزبون */}
        <div className="mb-6">
          <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
            <FaPhone className="mr-2" />
            هاتف الزبون (اختياري)
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="0123456789"
            className="input-field"
          />
        </div>

        {/* ملاحظات */}
        <div className="mb-8">
          <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
            <FaStickyNote className="mr-2" />
            ملاحظات إضافية (اختياري)
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            placeholder="أي ملاحظات إضافية..."
            className="input-field"
          />
        </div>

        {/* زر الحفظ */}
        <button
          onClick={handleSubmit}
          className="btn-primary w-full text-xl py-4"
        >
          <FaSave className="inline-block ml-2" />
          حفظ يوم العمل
        </button>
      </div>

      {/* آخر العمليات المسجلة */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FaHistory className="text-blue-600 mr-3 text-2xl" />
          آخر العمليات المسجلة
        </h3>

        {recentWork.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FaHistory className="text-4xl mb-4 mx-auto" />
            <p>لا توجد عمليات مسجلة بعد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-right">الزبون</th>
                  <th className="px-4 py-3 text-right">الخدمة</th>
                  <th className="px-4 py-3 text-right">الساعات</th>
                  <th className="px-4 py-3 text-right">المبلغ</th>
                  <th className="px-4 py-3 text-right">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recentWork.map(work => {
                  const amount = work.hours * work.price;
                  const statusColor = work.payStatus === 'أجل' ? 'bg-red-100 text-red-800' : 
                                     work.payStatus === 'نصف' ? 'bg-yellow-100 text-yellow-800' : 
                                     'bg-green-100 text-green-800';
                  
                  return (
                    <tr key={work.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{work.name}</td>
                      <td className="px-4 py-3">{work.service}</td>
                      <td className="px-4 py-3">{work.hours}</td>
                      <td className="px-4 py-3 font-bold">{amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${statusColor}`}>
                          {work.payStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
