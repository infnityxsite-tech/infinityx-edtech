import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SyllabusModalProps {
  courseTitle: string;
  courseLink: string;
  trigger?: React.ReactNode;
}

export function SyllabusModal({ courseTitle, courseLink, trigger }: SyllabusModalProps) {
  const [loading, setLoading] = useState(true);

  // Default trigger if none provided
  const defaultTrigger = (
    <Button variant="outline" className="w-full border-white/[0.08] text-slate-300 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400 h-8 md:h-9 text-xs rounded-lg">
      Syllabus <ExternalLink className="w-3 h-3 ml-1" />
    </Button>
  );

  return (
    <Dialog onOpenChange={(isOpen) => { if (isOpen) setLoading(true); }}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 flex flex-col overflow-hidden bg-slate-900 border-slate-700">
        <div className="p-3 md:p-4 bg-slate-800 text-white flex justify-between items-center border-b border-slate-700">
          <DialogTitle className="text-sm md:text-base font-bold">{courseTitle} — Syllabus</DialogTitle>
          <a href={courseLink} target="_blank" rel="noopener noreferrer" className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 z-10">
            Open Externally <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex-1 overflow-hidden relative bg-slate-100 flex items-center justify-center">
          {courseLink.includes('drive.google.com') ? (
            <>
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10">
                  <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mb-4" />
                  <p className="text-slate-500 font-medium animate-pulse">Loading Document...</p>
                </div>
              )}
              <iframe 
                src={courseLink.replace(/\/view.*$/, '/preview')} 
                className={`w-full h-full border-0 absolute inset-0 transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`} 
                allow="autoplay"
                onLoad={() => setLoading(false)}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full flex-col text-slate-500 p-6 text-center w-full bg-slate-100">
              <ExternalLink className="w-12 h-12 mb-4 opacity-50" />
              <p>This syllabus is hosted externally.</p>
              <a href={courseLink} target="_blank" rel="noopener noreferrer" className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold transition-colors">
                View Document
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
