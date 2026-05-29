const STEPS = [
  {
    num: '01',
    title: 'Search & Discover',
    desc: 'Browse businesses by city, category, or keyword. Filter by ratings, price, and amenities.',
  },
  {
    num: '02',
    title: 'Read Real Reviews',
    desc: 'See what locals actually think. No paid reviews, no fake accounts — just honest opinions.',
  },
  {
    num: '03',
    title: 'Visit & Review',
    desc: 'Go check it out yourself, then leave a review. Help the next person make a better choice.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="font-playfair text-3xl font-bold text-brand-dark mb-12 text-center">
        How It Works
      </h2>

      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        {STEPS.map((step, idx) => (
          <div key={step.num} className="relative pl-2">
            {/* decorative faded number */}
            <span className="step-number -top-4 -left-2 font-dm">
              {step.num}
            </span>

            {/* connecting dotted line between steps */}
            {idx < STEPS.length - 1 && (
              <div className="hidden md:block absolute top-8 -right-6 w-12 border-t-2 border-dashed border-surface-3" />
            )}

            <div className="relative z-10">
              <span className="font-mono text-xs text-brand-orange font-medium">
                Step {step.num}
              </span>
              <h3 className="font-playfair text-xl font-semibold text-brand-dark mt-2">
                {step.title}
              </h3>
              <p className="font-dm text-sm text-brand-muted mt-2 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
