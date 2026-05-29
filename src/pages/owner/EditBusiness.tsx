import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { fetchOwnerBusinesses, updateBusiness, fetchCategories } from '../../services/api';
import type { BusinessRow, CategoryRow } from '../../services/api';

interface BusinessForm {
  name: string;
  tagline: string;
  description: string;
  category_id: string;
  price_range: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website: string;
  whatsapp: string;
  lat: string;
  lng: string;
}

export default function EditBusiness() {
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<BusinessForm>();

  useEffect(() => {
    fetchCategories().then(setCategories);

    async function loadBusiness() {
      if (!id) return;
      try {
        const listings = await fetchOwnerBusinesses();
        const biz = listings.find(b => b.id === id);
        if (!biz) { navigate('/owner/listings'); return; }
        reset({
          name: biz.name,
          tagline: biz.tagline,
          description: biz.description,
          category_id: biz.category_id,
          price_range: biz.price_range,
          street: biz.address?.street || '',
          area: biz.address?.area || '',
          city: biz.address?.city || '',
          state: biz.address?.state || '',
          pincode: biz.address?.pincode || '',
          phone: biz.contact?.phone || '',
          email: biz.contact?.email || '',
          website: biz.contact?.website || '',
          whatsapp: biz.contact?.whatsapp || '',
          lat: biz.location?.lat?.toString() || '',
          lng: biz.location?.lng?.toString() || '',
        });
      } catch (err) {
        toast.error('Failed to load business');
      } finally {
        setLoading(false);
      }
    }
    loadBusiness();
  }, [id, reset, navigate]);

  async function onSubmit(vals: BusinessForm) {
    if (!id) return;
    setSaving(true);
    try {
      await updateBusiness(id, {
        name: vals.name,
        tagline: vals.tagline,
        description: vals.description,
        category_id: vals.category_id,
        price_range: vals.price_range,
        address: {
          street: vals.street,
          area: vals.area,
          city: vals.city,
          state: vals.state,
          pincode: vals.pincode,
        },
        contact: {
          phone: vals.phone,
          email: vals.email,
          website: vals.website,
          whatsapp: vals.whatsapp,
        },
        location: {
          lat: parseFloat(vals.lat) || 0,
          lng: parseFloat(vals.lng) || 0,
        },
      });
      toast.success('Business updated');
      navigate('/owner/listings');
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-surface-1 flex items-center justify-center">
        <div className="animate-pulse font-dm text-brand-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-surface-1">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-playfair text-3xl font-bold text-brand-dark mb-6">Edit Business</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-lg p-6 border border-surface-3 space-y-4">
            <h2 className="font-playfair text-lg font-semibold text-brand-dark">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Business Name</label>
                <input {...register('name', { required: true })} className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50" />
              </div>
              <div>
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Category</label>
                <select {...register('category_id', { required: true })} className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Tagline</label>
                <input {...register('tagline')} className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50" />
              </div>
              <div>
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Price Range</label>
                <select {...register('price_range')} className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50">
                  <option value="₹">₹ Budget-friendly</option>
                  <option value="₹₹">₹₹ Moderate</option>
                  <option value="₹₹₹">₹₹₹ Premium</option>
                  <option value="₹₹₹₹">₹₹₹₹ Luxury</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Description</label>
              <textarea {...register('description')} rows={4} className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50 resize-none" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-surface-3 space-y-4">
            <h2 className="font-playfair text-lg font-semibold text-brand-dark">Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Street</label>
                <input {...register('street')} className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50" />
              </div>
              <div>
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Area</label>
                <input {...register('area')} className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50" />
              </div>
              <div>
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">City</label>
                <input {...register('city')} className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50" />
              </div>
              <div>
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">State</label>
                <input {...register('state')} className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50" />
              </div>
              <div>
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Pincode</label>
                <input {...register('pincode')} className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-surface-3 space-y-4">
            <h2 className="font-playfair text-lg font-semibold text-brand-dark">Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Phone</label>
                <input {...register('phone')} className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50" />
              </div>
              <div>
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Email</label>
                <input {...register('email')} type="email" className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50" />
              </div>
              <div>
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Website</label>
                <input {...register('website')} className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50" />
              </div>
              <div>
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">WhatsApp</label>
                <input {...register('whatsapp')} className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-surface-3 space-y-4">
            <h2 className="font-playfair text-lg font-semibold text-brand-dark">Location</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Latitude</label>
                <input {...register('lat')} className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50" />
              </div>
              <div>
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Longitude</label>
                <input {...register('lng')} className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-dm font-medium py-3 rounded transition-colors disabled:opacity-50 text-sm"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
