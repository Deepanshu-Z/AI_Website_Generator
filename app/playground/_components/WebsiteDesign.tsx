import React, { useContext, useEffect, useRef, useState } from "react";
import { WebPageTools } from "./WebPageTools";
import { ElementSettingSection } from "./ElementSectionSetting";
import ImageSettingSection from "./ImageSettingSection";
import { OnSaveContext } from "@/app/context/OnSaveContext";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useSearchParams } from "next/navigation";

type Props = {
  generatedCode: string;
  loading: boolean;
};

const HTML_CODE = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
            <title>AI Website Builder</title>

            <!-- Tailwind CSS -->
            <script src="https://cdn.tailwindcss.com"></script>

            <!-- Flowbite CSS & JS -->
            <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

            <!-- Font Awesome / Lucide -->
            <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

            <!-- Chart.js -->
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body id="root"></body>
        </html>
      `;
export const WebsiteDesign = ({ generatedCode, loading }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedSize, setSelectedSize] = useState("web");
  const [selectedEl, setSelectedEl] = useState<HTMLElement | null>();
  const [onSaveData, setOnSaveData] = useContext(OnSaveContext);
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");
  // ******************************************************************************
  // Initialize iframe shell once
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(HTML_CODE);
    doc.close();

    let hoverEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      if (selectedEl) return;
      const target = e.target as HTMLElement;
      if (hoverEl && hoverEl !== target) {
        hoverEl.style.outline = "";
      }
      hoverEl = target;
      hoverEl.style.outline = "2px dotted blue";
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (selectedEl) return;
      if (hoverEl) {
        hoverEl.style.outline = "";
        hoverEl = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;

      if (selectedEl && selectedEl !== target) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
      }

      selectedEl = target;
      selectedEl.style.outline = "2px solid red";
      selectedEl.setAttribute("contenteditable", "true");
      selectedEl.focus();

      setSelectedEl(selectedEl);
    };

    const handleBlur = () => {
      if (selectedEl) {
        // console.log("Final edited element:", selectedEl.outerHTML);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedEl) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
        selectedEl.removeEventListener("blur", handleBlur);
        selectedEl = null;
      }
    };

    doc.body?.addEventListener("mouseover", handleMouseOver);
    doc.body?.addEventListener("mouseout", handleMouseOut);
    doc.body?.addEventListener("click", handleClick);
    doc?.addEventListener("keydown", handleKeyDown);

    // Cleanup on unmount
    return () => {
      doc.body?.removeEventListener("mouseover", handleMouseOver);
      doc.body?.removeEventListener("mouseout", handleMouseOut);
      doc.body?.removeEventListener("click", handleClick);
      doc?.removeEventListener("keydown", handleKeyDown);
    };
  }, [generatedCode]);

  // ******************************************************************************
  // Update body only when code changes
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const root = doc.getElementById("root");
    if (root) {
      root.innerHTML =
        generatedCode
          ?.replaceAll("```html", "")
          .replaceAll("```", "")
          .replace("html", "") ?? "";
    }
  }, [generatedCode]);

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  useEffect(() => {
    onSaveData && onSaveCode();
  }, [onSaveData]);

  const onSaveCode = async () => {
    if (iframeRef.current) {
      try {
        const iFrameDoc =
          iframeRef.current.contentDocument ||
          iframeRef.current.contentWindow?.document;

        if (iFrameDoc) {
          const cloneDoc = iFrameDoc.documentElement.cloneNode(
            true
          ) as HTMLElement;
          //remove all outlines
          const allEl = cloneDoc.querySelectorAll<HTMLElement>("*");
          allEl.forEach((el) => {
            el.style.outline = "";
            el.style.cursor = "";
          });

          const html = cloneDoc.outerHTML;

          const result = await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`,
            {
              designCode: html,
              frameId,
              projectId,
            }
          );

          toast.success("CODE IS UPDATED.");
        }
      } catch (error) {
        console.log("ERROR SAVING CODE: ", error);
      }
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <div
        className={`p-5 flex flex-col items-center transition-all duration-300 ${
          selectedEl ? "w-3/4" : "w-full"
        }`}
      >
        <iframe
          ref={iframeRef}
          className={`${
            selectedSize === "web" ? "w-full" : "w-130"
          } h-[560px] border rounded`}
          sandbox="allow-scripts allow-same-origin"
        />
        <WebPageTools
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          generatedCode={generatedCode}
        />
      </div>

      {selectedEl && selectedEl.tagName ? (
        selectedEl.tagName === "IMG" ? (
          // @ts-ignore
          <ImageSettingSection selectedEl={selectedEl} />
        ) : (
          // @ts-ignore
          <ElementSettingSection
            selectedEl={selectedEl}
            clearSelection={() => setSelectedEl(null)}
          />
        )
      ) : null}
    </div>
  );
};
