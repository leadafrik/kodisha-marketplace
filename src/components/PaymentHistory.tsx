'use client';

import { FC, useState, useEffect } from 'react';
import { CreditCard, Check, X, Clock, Download } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Transaction {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  mpesa_ref?: string;
  created_at: string;
  error_message?: string;
}

interface PaymentHistoryProps {
  userId?: string;
  isHost?: boolean;
}

const PaymentHistory: FC<PaymentHistoryProps> = ({ userId, isHost = false }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        // If no userId provided, use current user
        let queryUserId = userId;
        if (!queryUserId) {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user?.id) return;
          queryUserId = session.user.id;
        }

        let query = supabase
          .from('transactions')
          .select('*')
          .eq('user_id', queryUserId)
          .order('created_at', { ascending: false });

        if (filter !== 'all') {
          query = query.eq('status', filter);
        }

        const { data, error } = await query;

        if (error) throw error;

        const typedTransactions = (data || []) as Transaction[];
        setTransactions(typedTransactions);

        // Calculate total
        const total = typedTransactions
          .filter((t) => t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0);

        setTotalAmount(total);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, filter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <X className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <CreditCard size={24} className="text-blue-600" />
          <span>{isHost ? 'Payment History' : 'Transactions'}</span>
        </h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>

      {/* Summary Card */}
      {totalAmount > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6 border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Total Completed Transactions</p>
          <p className="text-3xl font-bold text-gray-900">KES {totalAmount.toLocaleString()}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        {['all', 'completed', 'pending', 'failed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg transition capitalize font-medium ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 text-lg">No transactions found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  M-Pesa Ref
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(transaction.created_at)}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    KES {transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transaction.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {transaction.mpesa_ref || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Error Messages */}
      {transactions.some((t) => t.error_message) && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-semibold text-red-900 mb-2">Failed Transactions:</p>
          <ul className="space-y-1 text-sm text-red-800">
            {transactions
              .filter((t) => t.error_message)
              .map((t) => (
                <li key={t.id}>
                  {t.id.substring(0, 8)}: {t.error_message}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
