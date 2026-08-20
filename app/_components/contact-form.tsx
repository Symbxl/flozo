"use client";

import { useActionState } from "react";
import { submitContact, type ContactFormState } from "@/app/_actions/contact";

// Lives here, not in the action module: a "use server" file may only export
// async functions.
const INITIAL_STATE: ContactFormState = { status: "idle" };

const FIELD_CLASS =
  "w-full rounded-2xl border border-solid border-black/[.08] bg-transparent px-4 text-sm transition-colors placeholder:text-zinc-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-foreground/25 dark:border-white/[.145] dark:placeholder:text-zinc-500";
const LABEL_CLASS = "text-sm font-medium";
const ERROR_CLASS = "text-sm text-red-600 dark:text-red-400";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className={ERROR_CLASS}>
      {message}
    </p>
  );
}

function SentNotice({ state }: { state: ContactFormState }) {
  return (
    <div className="rounded-2xl border border-solid border-black/[.08] bg-black/[.02] p-6 dark:border-white/[.145] dark:bg-white/[.03]">
      <p className="text-sm font-medium">Message sent</p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{state.message}</p>
    </div>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, INITIAL_STATE);

  if (state.status === "success") {
    return <SentNotice state={state} />;
  }

  return (
    // Fields are uncontrolled: React resets them to their `defaultValue` after
    // the action settles, so echoing the values back is what preserves a
    // rejected submission — and dropping them is what clears a sent one.
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={LABEL_CLASS} htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            placeholder="Your name or brand"
            defaultValue={state.values?.name}
            aria-invalid={state.errors?.name ? true : undefined}
            aria-describedby={state.errors?.name ? "contact-name-error" : undefined}
            className={`${FIELD_CLASS} h-12`}
          />
          <FieldError id="contact-name-error" message={state.errors?.name} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={LABEL_CLASS} htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            placeholder="you@company.com"
            defaultValue={state.values?.email}
            aria-invalid={state.errors?.email ? true : undefined}
            aria-describedby={state.errors?.email ? "contact-email-error" : undefined}
            className={`${FIELD_CLASS} h-12`}
          />
          <FieldError id="contact-email-error" message={state.errors?.email} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={LABEL_CLASS} htmlFor="contact-reason">
          Reason for contacting
        </label>
        <textarea
          id="contact-reason"
          name="reason"
          required
          rows={9}
          maxLength={2000}
          placeholder="Sponsorship, collab, or something else — a couple of sentences is plenty."
          defaultValue={state.values?.reason}
          aria-invalid={state.errors?.reason ? true : undefined}
          aria-describedby={state.errors?.reason ? "contact-reason-error" : undefined}
          className={`${FIELD_CLASS} min-h-40 resize-y py-3`}
        />
        <FieldError id="contact-reason-error" message={state.errors?.reason} />
      </div>

      {/* Bot bait: off-screen rather than `hidden`, which crawlers skip. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="flex h-12 w-full items-center justify-center rounded-full bg-foreground px-5 text-base font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc] sm:w-[220px]"
        >
          {pending ? "Sending…" : "Send message"}
        </button>
        <p aria-live="polite" className="text-sm text-zinc-600 dark:text-zinc-400">
          {state.status === "error" ? (
            <span className={ERROR_CLASS}>{state.message}</span>
          ) : (
            "I read every message and reply by email."
          )}
        </p>
      </div>
    </form>
  );
}
