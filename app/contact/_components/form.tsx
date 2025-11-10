"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send } from "lucide-react";

export default function Form() {
  return (
    <div>
      <div className="h-screen flex justify-center items-center  bg-gray-50 px-4">
        {/* <Header /> */}
        <Card className="w-screen max-w-md shadow-lg border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Get in Touch</CardTitle>
            <p className="text-gray-500 mt-2">
              I'd love to hear from you — feel free to reach out via email or
              message below.
            </p>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = "mailto:deepanshupokhriyal@example.com";
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Name
                </label>
                <Input placeholder="John Doe" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Email
                </label>
                <Input type="email" placeholder="you@example.com" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Message
                </label>
                <Textarea
                  placeholder="Write your message here..."
                  className="h-32 resize-none"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" /> Send Message
              </Button>

              <div className="text-center mt-4 text-sm text-gray-500">
                <Mail className="inline mr-1 h-4 w-4" />
                or email directly:{" "}
                <a
                  href="mailto:deepanshupokhriyal07@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  deepanshupokhriyal07@gmail.com
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
