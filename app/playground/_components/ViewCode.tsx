import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy } from "lucide-react";
//@ts-ignore
import SyntaxHighlighter from "react-syntax-highlighter";
//@ts-ignore
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { toast } from "sonner";

export const ViewCode = ({ children, finalCode }: any) => {
  const copyText = async () => {
    await navigator.clipboard.writeText(finalCode);
    toast.success("Code Copied!");
  };
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="min-w-7xl max-h-[600px] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-4">
              SOURCE CODE
              <Button onClick={copyText}>
                <Copy />
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            <div>
              <SyntaxHighlighter language="javascript" style={docco}>
                {finalCode}
              </SyntaxHighlighter>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
