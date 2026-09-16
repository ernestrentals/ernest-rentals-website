"use client";

import {
  useState,
} from "react";

type Props = {
  title: string;
  description: string;
  url: string;
};

function Icon({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
      {children}
    </span>
  );
}

export default function BillboardShareButtons({
  title,
  description,
  url,
}: Props) {
  const [
    copied,
    setCopied,
  ] =
    useState(false);

  const encodedUrl =
    encodeURIComponent(
      url
    );

  const encodedTitle =
    encodeURIComponent(
      title
    );

  const encodedMessage =
    encodeURIComponent(
      `${title}\n${description}\n${url}`
    );

  const shareLinks = [
    {
      label:
        "WhatsApp",
      href:
        `https://wa.me/?text=${encodedMessage}`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M12 20a8 8 0 1 0-6.9-4L4 20l4.2-1.1A8 8 0 0 0 12 20Z" />
          <path d="M9 8.5c.5 2 2 3.5 4 4l1-1c.2-.2.5-.3.8-.1l1.5.7c.3.1.4.4.4.7-.2 1.4-1.4 2.3-2.8 2.2-3.8-.4-6.9-3.5-7.3-7.3C6.5 6.3 7.4 5.1 8.8 5c.3 0 .6.1.7.4l.7 1.5c.1.3.1.6-.1.8l-1.1.8Z" />
        </svg>
      ),
    },
    {
      label:
        "Facebook",
      href:
        `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z" />
        </svg>
      ),
    },
    {
      label:
        "LinkedIn",
      href:
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M6.5 8.3H3.4V21h3.1V8.3ZM5 3A1.8 1.8 0 1 0 5 6.6 1.8 1.8 0 0 0 5 3ZM21 13.7c0-3.8-2-5.6-4.7-5.6-2.2 0-3.2 1.2-3.7 2V8.3H9.5V21h3.1v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2 1.9 2 3.4V21H20l1-7.3Z" />
        </svg>
      ),
    },
    {
      label:
        "X",
      href:
        `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M18.3 3H21l-5.9 6.7L22 21h-5.4l-4.2-5.5L7.6 21H4.9l6.2-7.1L4.5 3H10l3.8 5.1L18.3 3Zm-1 16h1.5L9.2 4.9H7.6L17.3 19Z" />
        </svg>
      ),
    },
  ];

  async function nativeShare() {
    if (
      typeof navigator !==
        "undefined" &&
      navigator.share
    ) {
      try {
        await navigator.share({
          title,
          text:
            description,
          url,
        });
      } catch {
        // User cancelled or browser blocked the share sheet.
      }

      return;
    }

    await copyLink();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        url
      );

      setCopied(
        true
      );

      window.setTimeout(
        () =>
          setCopied(
            false
          ),
        1800
      );
    } catch {
      const input =
        document.createElement(
          "textarea"
        );

      input.value =
        url;

      document.body.appendChild(
        input
      );

      input.select();

      document.execCommand(
        "copy"
      );

      input.remove();

      setCopied(
        true
      );

      window.setTimeout(
        () =>
          setCopied(
            false
          ),
        1800
      );
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
            Share this billboard
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Send this advertising location to your team or clients.
          </p>
        </div>

        <button
          type="button"
          onClick={
            nativeShare
          }
          className="inline-flex items-center gap-2 rounded-xl bg-[#071226] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <circle
              cx="18"
              cy="5"
              r="2"
            />
            <circle
              cx="6"
              cy="12"
              r="2"
            />
            <circle
              cx="18"
              cy="19"
              r="2"
            />
            <path d="m8 11 8-5M8 13l8 5" />
          </svg>

          Share
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {shareLinks.map(
          (
            item
          ) => (
            <a
              key={
                item.label
              }
              href={
                item.href
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50/40 hover:text-orange-700"
            >
              <Icon>
                {
                  item.icon
                }
              </Icon>

              {
                item.label
              }
            </a>
          )
        )}

        <button
          type="button"
          onClick={
            copyLink
          }
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
        >
          <Icon>
            {copied ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="m5 12 4 4L19 6" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M9 15 15 9M8 7l1.4-1.4a4 4 0 0 1 5.7 5.7L13.7 13M16 17l-1.4 1.4a4 4 0 0 1-5.7-5.7L10.3 11" />
              </svg>
            )}
          </Icon>

          {copied
            ? "Copied"
            : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
