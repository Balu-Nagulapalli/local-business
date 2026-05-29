import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTABanner() {
  return (
    <section className="bg-brand-dark py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">
          Own a business? Get listed for free.
        </h2>
        <p className="mt-3 font-dm text-white/60 max-w-md mx-auto">
          Reach thousands of local customers. No setup fees, no hidden charges.
        </p>
        <Link
          to="/owner/listings/new"
          className="inline-flex items-center gap-2 mt-6 bg-brand-orange hover:bg-brand-orange/90 text-white font-dm font-medium px-8 py-3 rounded transition-colors"
        >
          Add Your Business <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
