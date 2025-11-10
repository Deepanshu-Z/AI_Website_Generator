import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Header } from "../_components/Header";

export default function About() {
  return (
    <div>
      <Header />
      <div className="flex h-screen items-center justify-center">
        <section className="text-center py-20">
          <h1 className="text-5xl font-bold">About Me</h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Hi, I'm <span className="font-semibold">Deepanshu Pokhriyal</span> —
            a passionate Full-Stack Developer who loves building modern web
            applications using technologies like <strong>React</strong>,{" "}
            <strong>Next.js</strong>, and <strong>Spring Boot</strong>.
            <br />I enjoy turning ideas into scalable, fast, and beautiful
            digital experiences.
          </p>
          <div className="mt-6">
            <Link href={"/contact"}>
              <Button>Get in Touch</Button>
            </Link>
          </div>
          <Separator className="mt-10" />
        </section>
      </div>
    </div>
  );
}
