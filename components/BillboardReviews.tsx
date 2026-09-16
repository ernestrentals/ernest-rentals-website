"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createBrowserClient,
} from "@/lib/supabase/client";

type Review = {
  review_id: string;
  reviewer_name: string;
  reviewer_company: string | null;
  rating: number;
  review_title: string | null;
  review_text: string;
  verified_client: boolean;
  created_at: string;
};

type Props = {
  billboardId: string;
  billboardName: string;
};

function Stars({
  rating,
  size = "normal",
  interactive = false,
  onChange,
}: {
  rating: number;
  size?: "small" | "normal" | "large";
  interactive?: boolean;
  onChange?: (
    rating: number
  ) => void;
}) {
  const sizeClass =
    size ===
    "large"
      ? "text-3xl"
      : size ===
          "small"
        ? "text-base"
        : "text-xl";

  return (
    <div
      className="flex gap-1"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map(
        (star) => {
          const active =
            star <=
            rating;

          if (
            interactive
          ) {
            return (
              <button
                key={
                  star
                }
                type="button"
                onClick={() =>
                  onChange?.(
                    star
                  )
                }
                className={`${sizeClass} leading-none transition ${
                  active
                    ? "text-orange-400"
                    : "text-slate-200 hover:text-orange-300"
                }`}
                aria-label={`${star} star${
                  star === 1
                    ? ""
                    : "s"
                }`}
              >
                ★
              </button>
            );
          }

          return (
            <span
              key={
                star
              }
              className={`${sizeClass} leading-none ${
                active
                  ? "text-orange-400"
                  : "text-slate-200"
              }`}
            >
              ★
            </span>
          );
        }
      )}
    </div>
  );
}

function formatReviewDate(
  value: string
) {
  try {
    return new Intl.DateTimeFormat(
      "en-US",
      {
        year:
          "numeric",
        month:
          "short",
        day:
          "numeric",
      }
    ).format(
      new Date(
        value
      )
    );
  } catch {
    return "";
  }
}

export default function BillboardReviews({
  billboardId,
  billboardName,
}: Props) {
  const supabase =
    useMemo(
      () =>
        createBrowserClient(),
      []
    );

  const [
    reviews,
    setReviews,
  ] =
    useState<
      Review[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    formOpen,
    setFormOpen,
  ] =
    useState(false);

  const [
    showAll,
    setShowAll,
  ] =
    useState(false);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    success,
    setSuccess,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    rating,
    setRating,
  ] =
    useState(5);

  const [
    reviewerName,
    setReviewerName,
  ] =
    useState("");

  const [
    company,
    setCompany,
  ] =
    useState("");

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    title,
    setTitle,
  ] =
    useState("");

  const [
    reviewText,
    setReviewText,
  ] =
    useState("");

  // Simple honeypot field for basic automated-spam resistance.
  const [
    website,
    setWebsite,
  ] =
    useState("");

  useEffect(() => {
    let cancelled =
      false;

    async function loadReviews() {
      setLoading(
        true
      );

      const {
        data,
        error:
          loadError,
      } =
        await supabase.rpc(
          "get_public_billboard_reviews",
          {
            p_billboard_id:
              billboardId,
          }
        );

      if (
        cancelled
      ) {
        return;
      }

      if (
        loadError
      ) {
        console.error(
          loadError
        );

        setReviews(
          []
        );
      } else {
        setReviews(
          (
            data ??
            []
          ) as Review[]
        );
      }

      setLoading(
        false
      );
    }

    loadReviews();

    return () => {
      cancelled =
        true;
    };
  }, [
    billboardId,
    supabase,
  ]);

  const averageRating =
    reviews.length >
    0
      ? reviews.reduce(
          (
            total,
            review
          ) =>
            total +
            Number(
              review.rating
            ),
          0
        ) /
        reviews.length
      : 0;

  const ratingCounts =
    [5, 4, 3, 2, 1].map(
      (star) => ({
        star,
        count:
          reviews.filter(
            (
              review
            ) =>
              Number(
                review.rating
              ) ===
              star
          ).length,
      })
    );

  const visibleReviews =
    showAll
      ? reviews
      : reviews.slice(
          0,
          4
        );

  async function submitReview(
    event: FormEvent
  ) {
    event.preventDefault();

    if (
      website
    ) {
      return;
    }

    setSubmitting(
      true
    );

    setError(
      ""
    );

    setSuccess(
      false
    );

    const {
      error:
        submitError,
    } =
      await supabase.rpc(
        "submit_public_billboard_review",
        {
          p_billboard_id:
            billboardId,

          p_reviewer_name:
            reviewerName,

          p_reviewer_company:
            company,

          p_reviewer_email:
            email,

          p_rating:
            rating,

          p_review_title:
            title,

          p_review_text:
            reviewText,
        }
      );

    if (
      submitError
    ) {
      console.error(
        submitError
      );

      setError(
        submitError.message ||
          "We could not submit your review. Please try again."
      );

      setSubmitting(
        false
      );

      return;
    }

    setSuccess(
      true
    );

    setReviewerName(
      ""
    );

    setCompany(
      ""
    );

    setEmail(
      ""
    );

    setTitle(
      ""
    );

    setReviewText(
      ""
    );

    setRating(
      5
    );

    setSubmitting(
      false
    );
  }

  return (
    <section className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
              Customer Reviews
            </p>

            <h2 className="mt-1.5 text-xl font-black text-[#071226]">
              What advertisers say
            </h2>

            <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500">
              See feedback from advertisers who have used this Ernest Rentals billboard.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setFormOpen(
                (
                  value
                ) =>
                  !value
              );

              setSuccess(
                false
              );

              setError(
                ""
              );
            }}
            className="rounded-xl bg-[#071226] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            {formOpen
              ? "Close Review Form"
              : "Write a Review"}
          </button>
        </div>
      </div>

      {/* RATING SUMMARY */}

      <div className="grid gap-5 border-b border-slate-200 bg-slate-50/60 p-5 lg:grid-cols-[210px_1fr]">
        <div className="flex items-center gap-5 lg:block">
          <div>
            <p className="text-4xl font-black tracking-tight text-[#071226]">
              {reviews.length >
              0
                ? averageRating.toFixed(
                    1
                  )
                : "—"}
            </p>

            <div className="mt-2">
              <Stars
                rating={
                  Math.round(
                    averageRating
                  )
                }
              />
            </div>

            <p className="mt-1.5 text-xs text-slate-500">
              {reviews.length >
              0
                ? `${reviews.length} review${
                    reviews.length ===
                    1
                      ? ""
                      : "s"
                  }`
                : "No approved reviews yet"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {ratingCounts.map(
            (
              item
            ) => {
              const percentage =
                reviews.length >
                0
                  ? Math.round(
                      (
                        item.count /
                        reviews.length
                      ) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={
                    item.star
                  }
                  className="grid grid-cols-[30px_1fr_34px] items-center gap-2.5"
                >
                  <span className="text-xs font-bold text-slate-500">
                    {
                      item.star
                    }★
                  </span>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-orange-400"
                      style={{
                        width:
                          `${percentage}%`,
                      }}
                    />
                  </div>

                  <span className="text-right text-xs font-semibold text-slate-400">
                    {
                      item.count
                    }
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* REVIEW FORM */}

      {formOpen && (
        <form
          onSubmit={
            submitReview
          }
          className="border-b border-slate-200 bg-white p-5"
        >
          <div className="mx-auto max-w-2xl">
            <p className="font-black text-slate-900">
              Review{" "}
              {
                billboardName
              }
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Reviews are checked by Ernest Rentals before they appear publicly.
            </p>

            <div className="mt-4">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Your Rating
              </label>

              <div className="mt-2">
                <Stars
                  rating={
                    rating
                  }
                  size="large"
                  interactive
                  onChange={
                    setRating
                  }
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label>
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Name *
                </span>

                <input
                  required
                  maxLength={
                    100
                  }
                  value={
                    reviewerName
                  }
                  onChange={(
                    event
                  ) =>
                    setReviewerName(
                      event.target.value
                    )
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </label>

              <label>
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Company
                </span>

                <input
                  maxLength={
                    150
                  }
                  value={
                    company
                  }
                  onChange={(
                    event
                  ) =>
                    setCompany(
                      event.target.value
                    )
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </label>
            </div>

            <label className="mt-3.5 block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Email *
              </span>

              <input
                required
                type="email"
                maxLength={
                  254
                }
                value={
                  email
                }
                onChange={(
                  event
                ) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="Used only for review verification"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />

              <span className="mt-1 block text-xs text-slate-400">
                Your email is private and will never be shown with the review.
              </span>
            </label>

            <label className="mt-3.5 block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Review Title
              </span>

              <input
                maxLength={
                  120
                }
                value={
                  title
                }
                onChange={(
                  event
                ) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="e.g. Excellent roadside visibility"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </label>

            <label className="mt-3.5 block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Your Review *
              </span>

              <textarea
                required
                minLength={
                  10
                }
                maxLength={
                  2000
                }
                rows={
                  4
                }
                value={
                  reviewText
                }
                onChange={(
                  event
                ) =>
                  setReviewText(
                    event.target.value
                  )
                }
                placeholder="Tell other advertisers about your experience with this billboard..."
                className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />

              <span className="mt-1 block text-right text-xs text-slate-400">
                {
                  reviewText.length
                }
                /2000
              </span>
            </label>

            {/* Honeypot */}
            <div
              className="hidden"
              aria-hidden="true"
            >
              <label>
                Website
                <input
                  tabIndex={
                    -1
                  }
                  autoComplete="off"
                  value={
                    website
                  }
                  onChange={(
                    event
                  ) =>
                    setWebsite(
                      event.target.value
                    )
                  }
                />
              </label>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {
                  error
                }
              </div>
            )}

            {success && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                Thank you. Your review has been submitted for approval.
              </div>
            )}

            <button
              type="submit"
              disabled={
                submitting
              }
              className="mt-4 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting
                ? "Submitting Review..."
                : "Submit Review"}
            </button>
          </div>
        </form>
      )}

      {/* APPROVED REVIEWS */}

      <div className="p-5">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map(
              (
                item
              ) => (
                <div
                  key={
                    item
                  }
                  className="h-44 animate-pulse rounded-2xl bg-slate-100"
                />
              )
            )}
          </div>
        ) : reviews.length >
          0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {visibleReviews.map(
                (
                  review
                ) => (
                  <article
                    key={
                      review.review_id
                    }
                    className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <Stars
                        rating={
                          Number(
                            review.rating
                          )
                        }
                        size="small"
                      />

                      <span className="text-xs text-slate-400">
                        {formatReviewDate(
                          review.created_at
                        )}
                      </span>
                    </div>

                    {review.review_title && (
                      <h3 className="mt-3 font-black text-slate-900">
                        {
                          review.review_title
                        }
                      </h3>
                    )}

                    <p className="mt-2.5 text-sm leading-5 text-slate-600">
                      &ldquo;
                      {
                        review.review_text
                      }
                      &rdquo;
                    </p>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">
                          {
                            review.reviewer_name
                          }
                        </p>

                        {review.verified_client && (
                          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                            ✓ Verified Client
                          </span>
                        )}
                      </div>

                      {review.reviewer_company && (
                        <p className="mt-1 text-xs text-slate-400">
                          {
                            review.reviewer_company
                          }
                        </p>
                      )}
                    </div>
                  </article>
                )
              )}
            </div>

            {reviews.length >
              4 && (
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setShowAll(
                      (
                        value
                      ) =>
                        !value
                    )
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                >
                  {showAll
                    ? "Show Fewer Reviews"
                    : `Show All ${reviews.length} Reviews`}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl bg-slate-50 px-5 py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl text-orange-500">
              ★
            </div>

            <p className="mt-3 font-black text-slate-900">
              No reviews yet
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Have you advertised on this billboard? Share your experience with other businesses.
            </p>

            <button
              type="button"
              onClick={() =>
                setFormOpen(
                  true
                )
              }
              className="mt-5 text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              Write the first review →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
