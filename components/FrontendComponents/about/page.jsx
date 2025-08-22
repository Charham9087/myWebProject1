"use client";

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">📦 About Ghari Point</h1>

      <p className="text-center text-gray-600 max-w-3xl mx-auto">
        Ghari Point is your trusted destination for high-quality tech and mobile accessories — from watches to smart gadgets.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">🚀 How We Started</h2>
          <p className="text-gray-700">
            Ghari Point was founded by <strong>Ch Arham</strong> in 2025 — a passionate new businessman 
            who set out to build a brand rooted in value and honesty.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">🎯 Our Mission</h2>
          <p className="text-gray-700">
            Our mission is to grow Ghari Point into a trusted name in the tech accessories space — 
            while staying fair, transparent, and reliable.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">💡 What Makes Us Different</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Honest and transparent business practices</li>
            <li>Fast and friendly customer support</li>
            <li>High-quality products only</li>
            <li>We care about your satisfaction, not just profit</li>
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">💰 Our Pricing Philosophy</h2>
          <p className="text-gray-700">
            At Ghari Point, we believe in valuable pricing — not overpricing. That’s why we keep our 
            <strong> profit margins low</strong> and offer <strong> fair, affordable rates</strong> 
            so you get more value for your money.
          </p>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-gray-500">
          Thank you for trusting Ghari Point. We’re here to serve you — honestly, affordably, and with care.
        </p>
      </div>
    </div>
  );
}
