import { Hero } from "../_components/Hero";

export default function page({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Hero />
    </div>
  );
}
