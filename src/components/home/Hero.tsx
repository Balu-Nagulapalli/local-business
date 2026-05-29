import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const CITIES = ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Bangalore', 'Chennai', 'Pune'];
const CATS = ['All Categories', 'Restaurants', 'Healthcare', 'Education', 'Shopping', 'Fitness', 'Professional Services'];

export default function Hero() {
  const [city, setCity] = useState('Hyderabad');
  const [category, setCategory] = useState('All Categories');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (city) params.set('city', city);
    if (category !== 'All Categories') params.set('category', category.toLowerCase());
    navigate(`/search?${params.toString()}`);
  }

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* full-bleed background with gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1091167/pexels-photo-1091167.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/50 to-brand-dark/80" />
      </div>

      {/* content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="font-playfair text-4xl sm:text-5xl md:text-[56px] font-bold text-white leading-[1.15] tracking-tight">
          Find the best local<br />businesses near you
        </h1>
        <p className="mt-5 font-dm text-lg sm:text-xl text-white/70 max-w-xl mx-auto">
          Trusted reviews from real people in your city
        </p>

        {/* search bar */}
        <form
          onSubmit={handleSearch}
          className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-lg overflow-hidden shadow-lg max-w-2xl mx-auto"
        >
          {/* city selector */}
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="px-4 py-3 text-sm font-dm text-txt-primary bg-surface-2 border-r border-surface-3 focus:outline-none cursor-pointer"
          >
            {CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* category selector */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-3 text-sm font-dm text-txt-primary bg-white border-r border-surface-3 focus:outline-none cursor-pointer hidden sm:block"
          >
            {CATS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* search input */}
          <div className="flex-1 px-4 py-3">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full text-sm font-dm text-txt-primary placeholder-brand-muted focus:outline-none"
            />
          </div>

          {/* search button */}
          <button
            type="submit"
            className="bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-3 font-dm font-medium text-sm transition-colors flex items-center gap-2 justify-center"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </form>

        {/* floating stat pills */}
        <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
          {[
            { val: '4,200+', label: 'Businesses' },
            { val: '18', label: 'Cities' },
            { val: '32K', label: 'Reviews' },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 flex items-center gap-2"
            >
              <span className="font-dm font-bold text-white text-lg">{stat.val}</span>
              <span className="font-dm text-white/60 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
