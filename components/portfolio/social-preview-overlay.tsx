import React from "react";
import Image from "next/image";
import type { SocialPlatform, SocialPreview } from "@/content/site-content";

const socialPreviewImageMap: Record<SocialPlatform, string | undefined> = {
  github: "/github.png",
  linkedin: "/linkedin.png",
  twitter: "/x.png",
  resume: undefined,
};

type SocialPreviewOverlayProps = {
  platform: SocialPlatform;
  label: string;
  preview?: SocialPreview;
};

export const SocialPreviewOverlay = React.memo<SocialPreviewOverlayProps>(
  ({ platform, label, preview }) => {
    const previewImage = socialPreviewImageMap[platform];
    const screenshotImage = preview?.previewImage ?? previewImage;
    if (!screenshotImage) {
      return null;
    }

    const isResume = platform === "resume";

    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-full mt-2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0 transition duration-200 group-focus-within:opacity-100 group-hover:opacity-100"
      >
        <div
          className={`relative h-[220px] w-[360px] overflow-hidden rounded-[28px] border border-white/20 shadow-[0_35px_60px_rgba(0,0,0,0.5)] transition duration-200 group-focus-within:shadow-[0_38px_80px_rgba(0,0,0,0.45)] group-hover:shadow-[0_38px_80px_rgba(0,0,0,0.45)] ${
            isResume ? "bg-neutral-800" : "bg-neutral-900"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <Image
            src={screenshotImage}
            alt={`${label} screenshot`}
            width={360}
            height={220}
            className={`h-full w-full ${isResume ? "object-contain" : "object-cover"}`}
            loading="lazy"
            quality={75}
            sizes="360px"
            style={{ imageRendering: "auto" }}
          />
        </div>
      </div>
    );
  }
);

SocialPreviewOverlay.displayName = "SocialPreviewOverlay";
