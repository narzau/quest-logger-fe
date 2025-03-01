export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ADHD Quest Tracker",
    url: "https://www.quest-logger-fe.vercel.app",
    description:
      "A gamified task management app designed specifically for people with ADHD",
    applicationCategory: "Productivity",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Gamified task tracking",
      "ADHD-friendly interface",
      "Progress tracking",
      "Achievement system",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
