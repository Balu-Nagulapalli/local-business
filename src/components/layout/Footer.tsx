import { Link } from 'react-router-dom';

// unequal columns on purpose — 4-col but not evenly weighted
export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white/70 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Col 1 — wider, brand stuff */}
          <div className="col-span-2 md:col-span-1 md:pr-8">
            <Link to="/" className="font-playfair italic text-2xl text-white">
              Localé
            </Link>
            <p className="mt-3 text-sm font-dm leading-relaxed">
              Trusted local business discovery for Indian cities.
              Real reviews from real people, not paid placements.
            </p>
          </div>

          {/* Col 2 — explore */}
          <div>
            <h4 className="font-dm font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/businesses" className="text-sm font-dm hover:text-white transition-colors">All Businesses</Link></li>
              <li><Link to="/category/restaurants" className="text-sm font-dm hover:text-white transition-colors">Restaurants</Link></li>
              <li><Link to="/category/healthcare" className="text-sm font-dm hover:text-white transition-colors">Healthcare</Link></li>
              <li><Link to="/category/education" className="text-sm font-dm hover:text-white transition-colors">Education</Link></li>
              <li><Link to="/category/shopping" className="text-sm font-dm hover:text-white transition-colors">Shopping</Link></li>
              <li><Link to="/category/fitness" className="text-sm font-dm hover:text-white transition-colors">Fitness</Link></li>
            </ul>
          </div>

          {/* Col 3 — for business owners, narrower */}
          <div>
            <h4 className="font-dm font-semibold text-white text-sm uppercase tracking-wider mb-4">
              For Owners
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/owner/listings/new" className="text-sm font-dm hover:text-white transition-colors">Add Your Business</Link></li>
              <li><Link to="/register?role=owner" className="text-sm font-dm hover:text-white transition-colors">Claim Listing</Link></li>
              <li><Link to="/login" className="text-sm font-dm hover:text-white transition-colors">Owner Login</Link></li>
            </ul>
          </div>

          {/* Col 4 — contact + legal */}
          <div>
            <h4 className="font-dm font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm font-dm">hello@locale.in</span></li>
              <li><span className="text-sm font-dm">Hyderabad, India</span></li>
              <li><Link to="#" className="text-sm font-dm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-sm font-dm hover:text-white transition-colors">Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-dm text-white/40">
            &copy; 2026 Localé. Built with chai and stubbornness.
          </p>
          <p className="text-xs font-dm text-white/30">
            Business data is user-submitted and may not be current. Verify before visiting.
          </p>
        </div>
      </div>
    </footer>
  );
}
