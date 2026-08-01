"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Share2, Check, Copy, Download, Sparkles, Loader2 } from "lucide-react";
import { toJpeg } from "html-to-image";

interface BerojgariCertificateProps {
  userName?: string;
  college?: string;
  branch?: string;
  score: number;
  riskLevel: string;
  roast: string;
  predictedCtc?: number;
  topProject?: string;
  keyAchievement?: string;
}

export function BerojgariCertificate({
  userName = "Engineering Student",
  college = "IIT / NIT / Local Tier-3 College",
  branch = "CSE / IT / ECE",
  score,
  riskLevel,
  roast,
  predictedCtc = 4.5,
  topProject,
  keyAchievement,
}: BerojgariCertificateProps) {
  const [copied, setCopied] = useState(false);
  const [activeCaptionIdx, setActiveCaptionIdx] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const certId = `BEC-${score}-${Math.floor(1000 + Math.random() * 9000)}`;

  const captionOptions = [
    {
      title: " Wry Self-Deprecating Roast (Recommended)",
      text: `When Berojgar Engineer Club rates your Berojgar Risk as Level ${score}/100 \n\nAI Roast: "${roast}"\n\nCheck your employbility score before HR sends you an automated rejection email: https://berojgarengineer.club\n\n#BerojgarEngineerClub #PlacementSeason #Engineering`,
    },
    {
      title: " The Unfocused Genius Flex",
      text: `Officially scored ${score}/100 on Berojgar Engineer Club! \n\nPredicted CTC: ₹${predictedCtc} LPA (${riskLevel} Risk)\nAI Roast: "${roast}"\n\nAre you employable or cooked? Check your score now: https://berojgarengineer.club\n\n#BerojgarEngineerClub #TechPlacement #SDE`,
    },
    {
      title: " Bureaucratic Audit Meme",
      text: `Received my Official Certificate of Berojgari (Audit #${certId})! \n\nLevel: ${score}/100 Risk Index: ${riskLevel}\nCertified by: Chief AI Assessor\n\nAudit yourself before final placements begin: https://berojgarengineer.club\n\n#BerojgarEngineerClub #EngineeringMemes`,
    },
  ];

  const currentCaption = captionOptions[activeCaptionIdx].text;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(currentCaption)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(currentCaption)}`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(currentCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJpg = async () => {
    if (!certRef.current) return;
    setIsDownloading(true);
    try {
      const filter = (node: HTMLElement) => {
        return !node.classList?.contains("no-print");
      };

      const dataUrl = await toJpeg(certRef.current, {
        quality: 0.98,
        cacheBust: true,
        backgroundColor: "#fffdf5",
        filter: filter as any,
      });
      const link = document.createElement("a");
      link.download = `Certificate-of-Berojgari-${userName.replace(/\s+/g, "_")}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.warn("Image capture fallback to print:", err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Official Funny Certificate Card Wrapper ── */}
      <div className="relative">
        {/* Floating Download Button (Outside certRef capture target) */}
        <button
          onClick={handleDownloadJpg}
          disabled={isDownloading}
          className="no-print z-10 absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100/90 px-3 py-1 text-[11px] font-bold text-amber-950 shadow-2xs hover:bg-amber-200 transition-colors disabled:opacity-50"
          title="Download JPG Certificate"
        >
          {isDownloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
          <span>{isDownloading ? "Generating JPG..." : "Download JPG"}</span>
        </button>

        <motion.div
          ref={certRef}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="print-certificate-only relative overflow-hidden rounded-[20px] border-4 border-amber-400 bg-linear-to-b from-amber-50/90 via-white to-amber-50/50 p-6 sm:p-8 shadow-xl text-foreground select-none"
        >
          {/* Certificate Corner Decorations */}
          <div className="absolute top-2 left-2 text-amber-500 text-xs font-mono">✦ ✦ ✦</div>
          <div className="absolute top-2 right-2 text-amber-500 text-xs font-mono">✦ ✦ ✦</div>
          <div className="absolute bottom-2 left-2 text-amber-500 text-xs font-mono">✦ ✦ ✦</div>
          <div className="absolute bottom-2 right-2 text-amber-500 text-xs font-mono">✦ ✦ ✦</div>

        {/* Certificate Outer Border */}
        <div className="border border-amber-300 p-4 sm:p-6 rounded-[14px]">
          {/* Header Seal + Title (Centered Stack) */}
          <div className="flex flex-col items-center justify-center text-center space-y-2.5">
            <div className="relative inline-flex items-center justify-center h-16 w-16 rounded-full bg-white border-2 border-amber-500 shadow-md p-1.5">
              <img src="/berojgar-logo.png" alt="Berojgar Logo" className="h-full w-full object-contain" />
            </div>

            <div className="inline-block rounded-full bg-amber-200/80 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-950 border border-amber-300 font-mono shadow-2xs">
              Official Placement Risk Audit
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-black text-amber-950 uppercase tracking-tight pt-1">
              Certificate of Berojgari
            </h2>
            <p className="text-[11px] text-amber-900 font-medium italic">
              Issued by the Ministry of Brutally Honest Engineering Career Intelligence
            </p>
          </div>

          {/* Certificate Body */}
          <div className="my-6 text-center space-y-3 border-y border-amber-200/80 py-5">
            <p className="text-xs text-amber-900/70 uppercase font-semibold">This is to certify that</p>
            <h3 className="font-heading text-lg sm:text-xl font-extrabold text-foreground tracking-tight underline decoration-amber-400 decoration-2 underline-offset-4">
              {userName}
            </h3>
            <p className="text-xs text-muted font-medium">
              {branch} Student at <span className="font-semibold text-foreground">{college}</span>
            </p>

            {/* Optional Highlight Tags */}
            {(topProject || keyAchievement) && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {topProject && (
                  <span className="rounded-full bg-amber-200/70 px-2.5 py-0.5 text-[10px] font-bold text-amber-950 font-mono">
                    🚀 {topProject}
                  </span>
                )}
                {keyAchievement && (
                  <span className="rounded-full bg-purple-200/70 px-2.5 py-0.5 text-[10px] font-bold text-purple-950 font-mono">
                    🏅 {keyAchievement}
                  </span>
                )}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="rounded-xl border border-amber-300 bg-white px-4 py-2 text-center shadow-xs">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Berojgar Score</p>
                <p className="font-mono text-2xl font-black text-amber-600">{score}<span className="text-xs text-muted">/100</span></p>
              </div>

              <div className="rounded-xl border border-amber-300 bg-white px-4 py-2 text-center shadow-xs">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Risk Level</p>
                <p className={`font-mono text-base font-black ${riskLevel === "HIGH" ? "text-rose-600" : riskLevel === "MEDIUM" ? "text-amber-600" : "text-emerald-600"}`}>
                  {riskLevel} RISK
                </p>
              </div>

              <div className="rounded-xl border border-amber-300 bg-white px-4 py-2 text-center shadow-xs">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Predicted CTC</p>
                <p className="font-mono text-base font-black text-foreground">₹{predictedCtc} LPA</p>
              </div>
            </div>

            {/* AI Roast Quote Box */}
            <div className="mt-4 rounded-xl border border-amber-300 bg-amber-100/50 p-3.5 text-xs text-amber-950 italic relative">
              &ldquo;{roast}&rdquo;
            </div>
          </div>

          {/* Footer Signatures */}
          <div className="flex items-end justify-between text-left text-[10px] text-amber-900/80 pt-1">
            <div>
              <p className="font-bold text-foreground">Chief AI Assessor</p>
              <p className="text-muted">Berojgar Engineer Club</p>
            </div>

            <div className="text-center">
              <span className="inline-block font-mono text-[9px] font-bold border border-amber-400 bg-amber-200/50 px-2 py-0.5 rounded-md text-amber-900">
                {certId}
              </span>
            </div>

            <div className="text-right">
              <p className="font-bold text-foreground">berojgarengineer.club</p>
              <p className="text-muted">Verified Reality Check</p>
            </div>
          </div>
        </div>
      </motion.div>
      </div>

      {/* ── Direct Social Media Share Controls & Viral Captions ── */}
      <div className="no-print rounded-[16px] border border-border bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 size={18} className="text-amber-600" />
            <h4 className="font-heading text-sm font-bold text-foreground">Viral Social Media Generator (Free Marketing)</h4>
          </div>
          <Badge variant="warning" className="text-[10px]">1-Click Flex</Badge>
        </div>

        {/* Caption Style Switcher Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {captionOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => setActiveCaptionIdx(i)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                activeCaptionIdx === i
                  ? "bg-foreground text-white shadow-xs"
                  : "bg-surface text-muted hover:text-foreground border border-border"
              }`}
            >
              {opt.title}
            </button>
          ))}
        </div>

        {/* Caption Preview Box */}
        <div className="relative rounded-[12px] border border-border bg-surface p-3.5 text-xs font-mono leading-relaxed text-foreground">
          <pre className="whitespace-pre-wrap font-sans">{currentCaption}</pre>
          <button
            onClick={handleCopyCaption}
            className="absolute top-2.5 right-2.5 rounded-lg border border-border bg-white p-1.5 text-muted hover:text-foreground hover:bg-slate-50 transition-colors"
            title="Copy Caption Text"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* X / Twitter Share */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-[10px] bg-black text-white px-3.5 py-2.5 text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Post on X</span>
          </a>

          {/* WhatsApp Share */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-[10px] bg-emerald-600 text-white px-3.5 py-2.5 text-xs font-bold hover:bg-emerald-700 transition-colors"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
            <span>WhatsApp Status</span>
          </a>

          {/* LinkedIn Copy Button */}
          <Button
            variant="ghost"
            size="md"
            onClick={handleCopyCaption}
            className="flex items-center justify-center gap-2 border border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100 text-xs font-bold h-10"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? "Caption Copied!" : "Copy LinkedIn Post"}</span>
          </Button>

          {/* Download Certificate JPG Button */}
          <Button
            variant="ghost"
            size="md"
            onClick={handleDownloadJpg}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 border border-amber-400 bg-amber-100/90 text-amber-950 hover:bg-amber-200 text-xs font-bold h-10 sm:col-span-3 disabled:opacity-50"
          >
            {isDownloading ? <Loader2 size={14} className="animate-spin text-amber-700" /> : <Download size={14} className="text-amber-700" />}
            <span>{isDownloading ? "Generating High-Res JPG Certificate..." : "Download Official Certificate (.JPG Image)"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
