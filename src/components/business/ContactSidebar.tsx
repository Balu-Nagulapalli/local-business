import { useState } from 'react';
import { Phone, Mail, Globe, MessageCircle, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { sendInquiry } from '../../services/api';
import type { BusinessRow } from '../../services/api';

interface ContactSidebarProps {
  business: BusinessRow;
}

interface InquiryForm {
  message: string;
  phone: string;
}

export default function ContactSidebar({ business }: ContactSidebarProps) {
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset } = useForm<InquiryForm>();

  async function onSubmit(vals: InquiryForm) {
    setSending(true);
    try {
      await sendInquiry(business.id, vals.message, vals.phone);
      toast.success('Message sent to the business owner');
      reset();
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  }

  const contact = business.contact || {};

  return (
    <div className="space-y-6">
      <div className="bg-surface-2 rounded-lg p-5">
        <h3 className="font-playfair text-lg font-semibold text-brand-dark mb-4">Contact</h3>

        {contact.phone && (
          <a href={`tel:${contact.phone}`} className="flex items-center gap-3 py-2 text-sm font-dm text-txt-primary hover:text-brand-orange transition-colors">
            <Phone className="w-4 h-4 text-brand-orange" />
            {contact.phone}
          </a>
        )}
        {contact.email && (
          <a href={`mailto:${contact.email}`} className="flex items-center gap-3 py-2 text-sm font-dm text-txt-primary hover:text-brand-orange transition-colors">
            <Mail className="w-4 h-4 text-brand-orange" />
            {contact.email}
          </a>
        )}
        {contact.website && (
          <a href={contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-2 text-sm font-dm text-txt-primary hover:text-brand-orange transition-colors">
            <Globe className="w-4 h-4 text-brand-orange" />
            Visit Website
          </a>
        )}
        {contact.whatsapp && (
          <a
            href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 py-2 text-sm font-dm text-green-600 hover:text-green-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        )}
      </div>

      <div className="bg-surface-2 rounded-lg p-5">
        <h3 className="font-playfair text-lg font-semibold text-brand-dark mb-4">
          Send Message
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <textarea
            {...register('message', { required: true })}
            rows={3}
            placeholder="Your message..."
            className="w-full px-3 py-2 text-sm font-dm bg-white border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50 resize-none"
          />
          <input
            {...register('phone')}
            placeholder="Your phone (optional)"
            className="w-full px-3 py-2 text-sm font-dm bg-white border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50"
          />
          <button
            type="submit"
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white text-sm font-dm font-medium py-2.5 rounded transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
