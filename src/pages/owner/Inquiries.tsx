import { useEffect, useState } from 'react';
import { fetchOwnerInquiries } from '../../services/api';
import { MessageCircle } from 'lucide-react';
import { timeAgo } from '../../utils/timeAgo';

interface InquiryRow {
  id: string;
  business_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
  businesses: { id: string; name: string; slug: string } | null;
}

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwnerInquiries()
      .then(data => setInquiries(data as InquiryRow[]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-surface-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle className="w-6 h-6 text-brand-orange" />
          <h1 className="font-playfair text-3xl font-bold text-brand-dark">Messages</h1>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-surface-3 rounded" />
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-playfair text-xl text-brand-dark">No messages yet</p>
            <p className="font-dm text-sm text-brand-muted mt-2">
              When users send you a message, it will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {inquiries.map(inq => (
              <div key={inq.id} className={`py-5 ${!inq.is_read ? 'bg-brand-orange/5 -mx-4 px-4' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-dm font-medium text-sm text-txt-primary">
                      {inq.name || 'Anonymous'}
                    </p>
                    <p className="font-mono text-[10px] text-brand-muted">
                      {inq.email} {inq.phone && `· ${inq.phone}`}
                    </p>
                    <p className="font-dm text-sm text-txt-secondary mt-2">
                      {inq.message}
                    </p>
                    <p className="font-mono text-[10px] text-brand-muted mt-1">
                      Re: {inq.businesses?.name || 'Unknown'} · {timeAgo(inq.created_at)}
                    </p>
                  </div>
                  {!inq.is_read && (
                    <span className="w-2 h-2 bg-brand-orange rounded-full flex-shrink-0 mt-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
