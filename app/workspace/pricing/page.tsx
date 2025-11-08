import { PricingTable } from "@clerk/nextjs";

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <h2 className="font-bold text-3xl mb-8">Pricing</h2>
      <div className="w-full max-w-4xl">
        <PricingTable />
      </div>
    </div>
  );
}
