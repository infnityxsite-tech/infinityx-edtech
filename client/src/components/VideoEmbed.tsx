import React from "react";

interface VideoEmbedProps {
    videoId: string;
}

export function VideoEmbed({ videoId }: VideoEmbedProps) {
    if (!videoId) return null;

    return (
        <div className="w-full aspect-video rounded-xl shadow-lg my-8 overflow-hidden bg-slate-100 flex items-center justify-center">
            <iframe
                className="w-full h-full border-0"
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}
