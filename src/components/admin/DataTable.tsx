import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
}

export default function DataTable<T extends Record<string, any>>({ columns, data, onRowClick, actions }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp = typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-dm">
        <thead>
          <tr className="border-b border-surface-3">
            {columns.map(col => (
              <th
                key={col.key}
                className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-brand-muted font-medium"
              >
                {col.sortable ? (
                  <button
                    onClick={() => handleSort(col.key)}
                    className="flex items-center gap-1 hover:text-brand-orange transition-colors"
                  >
                    {col.label}
                    {sortKey === col.key ? (
                      sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    ) : null}
                  </button>
                ) : col.label}
              </th>
            ))}
            {actions && (
              <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-brand-muted font-medium">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              className={`admin-row-hover border-b border-surface-3/50 cursor-pointer hover:bg-surface-2/50 transition-colors ${
                idx % 2 === 0 ? '' : ''
              }`}
            >
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-txt-primary">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
