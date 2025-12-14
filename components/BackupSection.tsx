'use client';

import { useState, useMemo } from 'react';
import { 
  FaDatabase, 
  FaDownload, 
  FaUpload, 
  FaHistory, 
  FaRobot,
  FaFileExport,
  FaFileCsv,
  FaCloudUploadAlt,
  FaInfoCircle,
  FaUndo,
  FaTrash,
  FaFileImport,
  FaCopy
} from 'react-icons/fa';
import { useData } from '@/hooks/useData';
import { useNotification } from '@/hooks/useNotification';

interface BackupFile {
  id: string;
  name: string;
  date: string;
  size: number;
  data: any;
}

export default function BackupSection() {
  const { data, exportData, importData, resetData } = useData();
  const { showNotification } = useNotification();
  
  const [backupFiles, setBackupFiles] = useState<BackupFile[]>(() => {
    const saved = localStorage.getItem('tractor_backups');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [autoBackup, setAutoBackup] = useState(() => {
    return localStorage.getItem('auto_backup') === 'true';
  });

  // إحصائيات النسخ الاحتياطي
  const backupStats = useMemo(() => {
    const totalSize = backupFiles.reduce((sum, file) => sum + file.size, 0);
    const lastBackup = backupFiles.length > 0 
      ? backupFiles[backupFiles.length - 1].date 
      : '---';
    
    return {
      totalBackups: backupFiles.length,
      totalSize: (totalSize / 1024).toFixed(2), // KB
      lastBackup,
      autoBackupCount: backupFiles.filter(f => f.name.includes('تلقائي')).length,
    };
  }, [backupFiles]);

  // إنشاء نسخة احتياطية
  const createBackup = (isAuto = false) => {
    const backupId = Date.now().toString();
    const backupName = isAuto 
      ? `نسخة تلقائية ${new Date().toLocaleDateString('ar-SA')}`
      : `نسخة يدوية ${new Date().toLocaleDateString('ar-SA')}`;
    
    const newBackup: BackupFile = {
      id: backupId,
      name: backupName,
      date: new Date().toLocaleString('ar-SA'),
      size: JSON.stringify(data).length,
      data: { ...data }, // نسخة عميقة من البيانات
    };

    const updatedBackups = [...backupFiles, newBackup];
    
    // الاحتفاظ فقط بـ 10 نسخ
    if (updatedBackups.length > 10) {
      updatedBackups.shift();
    }

    setBackupFiles(updatedBackups);
    localStorage.setItem('tractor_backups', JSON.stringify(updatedBackups));
    
    if (!isAuto) {
      showNotification('تم إنشاء نسخة احتياطية بنجاح', 'success');
    }
  };

  // استعادة نسخة احتياطية
  const restoreBackup = (backupId: string) => {
    const backup = backupFiles.find(b => b.id === backupId);
    if (!backup) return;

    if (confirm('هل تريد استعادة هذه النسخة الاحتياطية؟ سيتم استبدال البيانات الحالية.')) {
      importData(backup.data);
      showNotification('تم استعادة النسخة الاحتياطية بنجاح', 'success');
    }
  };

  // حذف نسخة احتياطية
  const deleteBackup = (backupId: string) => {
    if (confirm('هل تريد حذف هذه النسخة الاحتياطية؟')) {
      const updatedBackups = backupFiles.filter(b => b.id !== backupId);
      setBackupFiles(updatedBackups);
      localStorage.setItem('tractor_backups', JSON.stringify(updatedBackups));
      showNotification('تم حذف النسخة الاحتياطية', 'success');
    }
  };

  // تفعيل/تعطيل النسخ التلقائي
  const toggleAutoBackup = () => {
    const newState = !autoBackup;
    setAutoBackup(newState);
    localStorage.setItem('auto_backup', newState.toString());
    
    if (newState) {
      // إنشاء نسخة تلقائية فورية
      createBackup(true);
      showNotification('تم تفعيل النسخ الاحتياطي التلقائي', 'success');
    } else {
      showNotification('تم إيقاف النسخ الاحتياطي التلقائي', 'info');
    }
  };

  // استيراد من ملف
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // التحقق من صحة البيانات
        if (importedData.work && importedData.expenses) {
          if (confirm('هل تريد استيراد البيانات من الملف؟ سيتم استبدال البيانات الحالية.')) {
            importData(importedData);
            showNotification('تم استيراد البيانات بنجاح', 'success');
          }
        } else {
          showNotification('تنسيق الملف غير صحيح', 'error');
        }
      } catch (error) {
        showNotification('خطأ في قراءة الملف', 'error');
      }
    };
    reader.readAsText(file);
    
    // إعادة تعيين حقل الملف
    event.target.value = '';
  };

  // تصدير كملف CSV
  const exportToCSV = () => {
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
    link.setAttribute('download', `tractor_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('تم تصدير البيانات كملف Excel', 'success');
  };

  // نسخ البيانات إلى الحافظة
  const copyToClipboard = () => {
    const dataStr = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(dataStr)
      .then(() => showNotification('تم نسخ البيانات إلى الحافظة', 'success'))
      .catch(() => showNotification('فشل نسخ البيانات', 'error'));
  };

  // إعادة تعيين البيانات
  const handleResetData = () => {
    if (confirm('هل تريد حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      resetData();
      showNotification('تم حذف جميع البيانات', 'success');
    }
  };

  return (
    <div className="space-y-8">
      {/* قسم النسخ الاحتياطي */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FaDatabase className="text-primary-600 mr-3 text-2xl" />
          نظام النسخ الاحتياطي والاستعادة
        </h3>

        {/* إحصائيات النسخ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-6 bg-white rounded-xl shadow border border-gray-200">
            <div className="text-3xl font-bold text-blue-600">{backupStats.totalBackups}</div>
            <div className="text-base text-gray-500 mt-2">عدد النسخ</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow border border-gray-200">
            <div className="text-3xl font-bold text-green-600">{backupStats.totalSize} KB</div>
            <div className="text-base text-gray-500 mt-2">حجم التخزين</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow border border-gray-200">
            <div className="text-3xl font-bold text-purple-600">{backupStats.lastBackup}</div>
            <div className="text-base text-gray-500 mt-2">آخر نسخة</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow border border-gray-200">
            <div className="text-3xl font-bold text-orange-600">{backupStats.autoBackupCount}</div>
            <div className="text-base text-gray-500 mt-2">نسخ تلقائية</div>
          </div>
        </div>

        {/* أزرار النسخ الاحتياطي */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* تصدير البيانات */}
          <div className="border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all shadow-md">
            <h4 className="font-bold text-xl mb-4 text-gray-700 flex items-center">
              <FaDownload className="text-blue-600 mr-3 text-2xl" />
              تصدير البيانات
            </h4>
            <p className="text-gray-600 mb-5 text-base">
              قم بتحميل نسخة احتياطية من جميع بياناتك لتخزينها بأمان على جهازك.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  exportData();
                  createBackup();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center text-lg shadow-md"
              >
                <FaFileExport className="mr-3 text-xl" />
                تصدير كملف JSON
              </button>
              <button
                onClick={exportToCSV}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center text-lg shadow-md"
              >
                <FaFileCsv className="mr-3 text-xl" />
                تصدير كملف Excel
              </button>
              <button
                onClick={copyToClipboard}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 px-5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center text-lg shadow-md"
              >
                <FaCopy className="mr-3 text-xl" />
                نسخ إلى الحافظة
              </button>
            </div>
          </div>

          {/* استيراد البيانات */}
          <div className="border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-300 transition-all shadow-md">
            <h4 className="font-bold text-xl mb-4 text-gray-700 flex items-center">
              <FaUpload className="text-purple-600 mr-3 text-2xl" />
              استيراد البيانات
            </h4>
            <p className="text-gray-600 mb-5 text-base">
              استرجع البيانات من نسخة احتياطية سابقة أو من جهاز آخر.
            </p>
            
            <div className="mb-5">
              <label className="block text-gray-700 text-base font-semibold mb-3">
                اختر ملف النسخ الاحتياطي
              </label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-purple-400 transition cursor-pointer shadow-inner"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <FaCloudUploadAlt className="text-4xl text-gray-400 mb-3 mx-auto" />
                <p className="text-gray-500 text-base">انقر لاختيار ملف JSON</p>
                <p className="text-gray-400 text-sm mt-2">أو اسحب الملف هنا</p>
                <input
                  id="fileInput"
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </div>
            </div>
            
            <button
              onClick={() => createBackup()}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 px-5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center text-lg shadow-md"
            >
              <FaFileImport className="mr-3 text-xl" />
              إنشاء نسخة يدوية
            </button>
          </div>
        </div>

        {/* النسخ التلقائي */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-md mb-8">
          <h4 className="font-bold text-xl mb-4 text-gray-700">النسخ التلقائي</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaRobot className="text-blue-500 text-2xl mr-3" />
              <div>
                <div className="font-semibold">النسخ الاحتياطي التلقائي</div>
                <div className="text-gray-600 text-sm">
                  يتم حفظ نسخة تلقائية عند إضافة بيانات جديدة
                </div>
              </div>
            </div>
            <button
              onClick={toggleAutoBackup}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                autoBackup
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {autoBackup ? 'مفعل ✓' : 'تفعيل'}
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-white rounded-xl">
            <div className="flex items-start">
              <FaInfoCircle className="text-blue-500 text-lg ml-3 mt-1" />
              <div className="text-gray-600 text-sm">
                يتم تخزين البيانات محلياً في متصفحك. قم بعمل نسخة احتياطية دورياً لحماية بياناتك من الفقدان.
                <button
                  onClick={handleResetData}
                  className="mr-3 text-red-600 hover:text-red-800 font-semibold text-sm"
                >
                  <FaTrash className="inline-block ml-1" />
                  حذف جميع البيانات
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* النسخ الاحتياطية المحفوظة */}
        <div className="card">
          <h4 className="font-bold text-xl mb-5 text-gray-700 flex items-center">
            <FaHistory className="text-gray-600 mr-3" />
            النسخ الاحتياطية المحفوظة
          </h4>
          
          {backupFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaDatabase className="text-3xl mb-3 mx-auto" />
              <p>لا توجد نسخ احتياطية محفوظة</p>
              <p className="text-sm mt-2">قم بإنشاء نسخة احتياطية أولاً</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto p-2">
              {[...backupFiles].reverse().map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <FaDatabase className="text-blue-500 text-xl" />
                    <div>
                      <div className="font-semibold">{backup.name}</div>
                      <div className="text-gray-500 text-sm">
                        {backup.date} • {(backup.size / 1024).toFixed(2)} KB
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => restoreBackup(backup.id)}
                      className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-colors"
                      title="استعادة"
                    >
                      <FaUndo />
                    </button>
                    <button
                      onClick={() => {
                        const dataStr = JSON.stringify(backup.data, null, 2);
                        const blob = new Blob([dataStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `backup_${backup.id}.json`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                      }}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
                      title="تحميل"
                    >
                      <FaDownload />
                    </button>
                    <button
                      onClick={() => deleteBackup(backup.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 text-sm text-gray-500">
            <FaInfoCircle className="inline-block ml-2" />
            يتم الاحتفاظ بآخر 10 نسخ احتياطية فقط
          </div>
        </div>
      </div>
    </div>
  );
}
