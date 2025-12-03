import React, { useState } from 'react';
import { ChevronDown, Search, RotateCcw, Check, Trash2, Edit } from 'lucide-react';

// Sample data matching the image
const initialData = [
  { id: 1, project: 'مشروع 1200 عامل لابس', units: 1, category: 'قيد التنفيذ', budget: 1200, delivered: 700, remaining: 500, contributions: 3, status: 'completed' },
  { id: 2, project: 'مشروع توزيع 50 وجبة', units: 1, category: 'تم التسليم', budget: 50, delivered: 20, remaining: 30, contributions: 33, status: 'completed' },
  { id: 3, project: 'مشروع 130 عامل لابس', units: 1, category: 'تم التسليم', budget: 130, delivered: 100, remaining: 30, contributions: 10, status: 'completed' },
  { id: 4, project: 'مشروع 30 عامل دقيق', units: 1, category: 'قيد التنفيذ', budget: 30, delivered: 10, remaining: 20, contributions: 2, status: 'completed' },
  { id: 5, project: 'مشروع 20 عامل فين', units: 1, category: 'ملغي', budget: 20, delivered: 10, remaining: 10, contributions: 2, status: 'completed' },
  { id: 6, project: 'مشروع 30 عامل ابن', units: 3, category: 'تم التسليم', budget: 1200, delivered: 1200, remaining: 1200, contributions: 1200, status: 'completed' },
  { id: 7, project: 'مشروع 20 عامل ابن', units: 3, category: 'ملغي', budget: 1200, delivered: 10, remaining: 10, contributions: 1200, status: 'completed' },
  { id: 8, project: 'مشروع 40 عامل ابن', units: 3, category: 'في الانتظار', budget: 1500, delivered: 1200, remaining: 1200, contributions: 1200, status: 'completed' },
  { id: 9, project: 'مشروع 20 عامل ابن', units: 3, category: 'ملغي', budget: 1200, delivered: 10, remaining: 10, contributions: 1200, status: 'completed' },
];

const DataTable = () => {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Get unique values for filters
  const uniqueProjects = [...new Set(data.map(item => item.project))];
  const uniqueCategories = [...new Set(data.map(item => item.category))];

  // Filter data
  const filteredData = data.filter(item => {
    const matchesSearch = item.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = !projectFilter || item.project === projectFilter;
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesProject && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category) => {
    switch(category) {
      case 'قيد التنفيذ': return 'bg-orange-100 text-orange-600';
      case 'تم التسليم': return 'bg-green-100 text-green-600';
      case 'ملغي': return 'bg-red-100 text-red-600';
      case 'في الانتظار': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleDelete = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setProjectFilter('');
    setCategoryFilter('');
    setStatusFilter('');
  };

  return (
    <div className="w-full bg-white p-6" dir="rtl">
      {/* Header with filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm font-medium">إعادة البحث</span>
        </button>

        {/* Search Button */}
        <button className="flex items-center gap-2 px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors">
          <Search className="w-4 h-4" />
          <span className="text-sm font-medium">بحث</span>
        </button>

        {/* Project Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors min-w-[150px] justify-between"
          >
            <ChevronDown className="w-4 h-4" />
            <span className="text-sm">{projectFilter || 'المشروع'}</span>
          </button>
          {projectDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
              <div
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                onClick={() => {
                  setProjectFilter('');
                  setProjectDropdownOpen(false);
                }}
              >
                الكل
              </div>
              {uniqueProjects.map((project, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                  onClick={() => {
                    setProjectFilter(project);
                    setProjectDropdownOpen(false);
                  }}
                >
                  {project}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors min-w-[150px] justify-between"
          >
            <ChevronDown className="w-4 h-4" />
            <span className="text-sm">{categoryFilter || 'حالة المشاريع'}</span>
          </button>
          {categoryDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
              <div
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                onClick={() => {
                  setCategoryFilter('');
                  setCategoryDropdownOpen(false);
                }}
              >
                الكل
              </div>
              {uniqueCategories.map((category, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                  onClick={() => {
                    setCategoryFilter(category);
                    setCategoryDropdownOpen(false);
                  }}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <button
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors min-w-[150px] justify-between"
          >
            <ChevronDown className="w-4 h-4" />
            <span className="text-sm">الحالة</span>
          </button>
          {statusDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
              <div
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                onClick={() => {
                  setStatusFilter('');
                  setStatusDropdownOpen(false);
                }}
              >
                الكل
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                onClick={() => {
                  setStatusFilter('completed');
                  setStatusDropdownOpen(false);
                }}
              >
                مكتمل
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">المشروع</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">الحالة</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">الاجمالي</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">تم تسليم</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">المتبقى</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">المساهمات</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">تفصيل</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">حذف</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">تم الانتهاء</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={row.id} className={`border-t border-gray-200 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{row.project}</div>
                  <div className="text-xs text-gray-500">عدد {row.units} طلبات</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(row.category)}`}>
                    {row.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">{row.budget}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">{row.delivered}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">{row.remaining}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">{row.contributions}</td>
                <td className="px-4 py-3 text-center">
                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button 
                    onClick={() => handleDelete(row.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-600">
        عرض {filteredData.length} من {data.length} نتائج
      </div>
    </div>
  );
};

export default DataTable;