"use client";
import React, { useEffect, useState } from "react";
import { ChatSection } from "../_components/ChatSection";
import { PlaygroundHeader } from "../_components/PlaygroundHeader";
import { WebsiteDesign } from "../_components/WebsiteDesign";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { decode } from "punycode";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
export type Frame = {
  projectId: string;
  frameId: string;
  designCode: string;
  chatMessages: Messages[];
};

export type Messages = {
  role: string;
  content: string;
};
export default function Playground() {
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");
  const [frameDetails, setFrameDetails] = useState<Frame>();
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [generatedCode, setGeneratedCode] = useState<any>();

  const prompt = ` userInput: {userInput}

Instructions:
VERY IMPORTANT : 

1. If the user input is explicitly asking to generate code, design, or HTML/CSS/JS output (e.g., "Create a landing page", "Build a dashboard", "Generate HTML Tailwind CSS code"), then:

   - Generate a complete HTML Tailwind CSS code using Flowbite UI components.  
   - Use a modern design with **blue as the primary color theme**.  
   - Only include the <body> content (do not add <head> or <title>).  
   - Make it fully responsive for all screen sizes.  
   - All primary components must match the theme color.  
   - Add proper padding and margin for each element.  
   - Components should be independent; do not connect them.  
   - Use placeholders for all images:  
       - Light mode: https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
       - Dark mode: https://www.cibaky.com/wp-content/uploads/2015/12/placeholder-3.jpg
       - Add alt tag describing the image prompt.  
   - Use the following libraries/components where appropriate:  
       - FontAwesome icons (fa fa-)  
       - Flowbite UI components: buttons, modals, forms, tables, tabs, alerts, cards, dialogs, dropdowns, accordions, etc.  
       - Chart.js for charts & graphs  
       - Swiper.js for sliders/carousels  
       - Tippy.js for tooltips & popovers  
   - Include interactive components like modals, dropdowns, and accordions.  
   - Ensure proper spacing, alignment, hierarchy, and theme consistency.  
   - Ensure charts are visually appealing and match the theme color.  
   - Header menu options should be spread out and not connected.  
   - Do not include broken links.  
   - Do not add any extra text before or after the HTML code.  

2. If the user input is **general text or greetings** (e.g., "Hi", "Hello", "How are you?") **or does not explicitly ask to generate code**, then:

   - Respond with a simple, friendly text message instead of generating any code.  

Example:

- User: "Hi" → Response: "Hello! How can I help you today?"  
- User: "Build a responsive landing page with Tailwind CSS" → Response: [Generate full HTML code as per instructions above]

`;

  useEffect(() => {
    frameId && getFrameDetails();
  }, [frameId]);

  const getFrameDetails = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        "/api/frame?frameId=" + frameId + "&projectId=" + projectId
      );
      setFrameDetails(result.data);

      const designCode = result.data?.designCode;

      if (designCode) {
        const index = designCode.indexOf("```html") + 7;
        const formattedCode = designCode.slice(index);
        setGeneratedCode(formattedCode);
      } else {
        console.warn("No designCode found for this frame.");
        setGeneratedCode(""); // or keep previous value
      }

      if (result.data.chatMessages.length == 1) {
        const firstInput = result.data.chatMessages[0].content;
        sendMessage(firstInput);
      } else {
        setMessages(result.data?.chatMessages);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error fetching frame details: ", error);
    }
  };

  const sendMessage = async (input: string) => {
    setLoading(true);
    setMessages((prev: any) => [...prev, { role: "user", content: input }]);
    try {
      const result = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `${prompt?.replace(
                "{userInput}",
                input
              )}\n\nAlways wrap your HTML output between triple backticks like this:\n\`\`\`html\n<!-- html code here -->\n\`\`\` DO NOT INCLUDE OTHER THAN CODE WHILE GENERATING CODES (LIKE PLAIN TEXT ETC)`,
            },
          ],
        }),
      });

      const reader = result.body?.getReader();
      const decoder = new TextDecoder();

      let aiRespose = "";
      let isCode = false;

      while (true) {
        //@ts-ignore
        const { done, value } = await reader?.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiRespose += chunk;

        if (!isCode && aiRespose.includes("```html")) {
          isCode = true;
          const index = aiRespose.indexOf("```html") + 7;
          const initialCodeChunk = aiRespose.slice(index);
          setGeneratedCode((prev: any) => prev + initialCodeChunk);
        } else if (isCode) {
          setGeneratedCode((prev: any) => prev + chunk);
        }
      }
      const htmlCode =
        aiRespose.split("```html")[1]?.split("```")[0]?.trim() || "";

      if (htmlCode != "") await saveGeneratedCode(htmlCode);

      if (!isCode) {
        setMessages((prev: any) => [
          ...prev,
          { role: "assistant", content: aiRespose },
        ]);
      } else {
        setMessages((prev: any) => [
          ...prev,
          { role: "assistant", content: "Your code is ready!" },
        ]);
      }

      setLoading(false);
    } catch (error) {
      console.log("ERROR CALLING GEMINI API ENDPOINT (DEEP)", error);
    }
  };

  useEffect(() => {
    if (messages.length > 1 && !loading) updateMessage();
  }, [messages]);

  const updateMessage = async () => {
    try {
      const result = await axios.put("/api/chats", {
        messages: messages,
        frameId: frameId,
      });
    } catch (error) {
      console.log("Error updating messages: ", error);
    }
  };

  const saveGeneratedCode = async (code: string) => {
    try {
      const result = await axios.put("/api/frame", {
        designCode: code,
        frameId,
        projectId,
      });
      toast.success("Website is ready!");
    } catch (error) {
      console.log("ERROR SAVING GENERATED CODE: ", error);
    }
  };

  return (
    <div>
      <PlaygroundHeader />

      <div className="flex">
        <ChatSection
          chatMessages={messages ?? []}
          onSend={(input: string) => sendMessage(input)}
          loading={loading}
        />

        <WebsiteDesign
          loading={loading}
          generatedCode={generatedCode?.replace("```", "")}
        />
        {/* <ElementSectionSetting /> */}
      </div>
    </div>
  );
}
