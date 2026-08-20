"use server";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 200 },
  reason: { min: 10, max: 2000 },
} as const;

// Deliberately loose: the only thing worth rejecting here is an address we
// could never reply to. Anything stricter starts turning away real addresses.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ContactFields = {
  name: string;
  email: string;
  reason: string;
};

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof ContactFields, string>>;
  /** Echoed back on failure so a rejected submission isn't retyped. */
  values?: Partial<ContactFields>;
};

function text(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function validate(fields: ContactFields) {
  const errors: ContactFormState["errors"] = {};

  if (fields.name.length < LIMITS.name.min) {
    errors.name = "Please tell me your name.";
  } else if (fields.name.length > LIMITS.name.max) {
    errors.name = `Please keep this under ${LIMITS.name.max} characters.`;
  }

  if (!fields.email) {
    errors.email = "Please add an email so I can reply.";
  } else if (!EMAIL_PATTERN.test(fields.email) || fields.email.length > LIMITS.email.max) {
    errors.email = "That email address doesn't look right.";
  }

  if (fields.reason.length < LIMITS.reason.min) {
    errors.reason = "A sentence or two about what you have in mind, please.";
  } else if (fields.reason.length > LIMITS.reason.max) {
    errors.reason = `Please keep this under ${LIMITS.reason.max} characters.`;
  }

  return errors;
}

async function deliver(fields: ContactFields) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Local work shouldn't need mail credentials, so log and carry on. In
    // production an unconfigured mailer is a real failure, not a no-op.
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Contact form is not configured: set RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL."
      );
    }
    console.info("[contact] delivery not configured, submission was:", fields);
    return;
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      // So hitting reply in the inbox goes straight back to the sender.
      reply_to: fields.email,
      subject: `Sponsorship / collab inquiry from ${fields.name}`,
      text: [
        `Name:  ${fields.name}`,
        `Email: ${fields.email}`,
        "",
        fields.reason,
      ].join("\n"),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const fields: ContactFields = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    reason: text(formData, "reason"),
  };

  // Honeypot: hidden from people, irresistible to form-filling bots. Answer as
  // if it worked so the bot has no signal to tune against.
  if (text(formData, "website")) {
    return { status: "success", message: "Thanks — your message is on its way." };
  }

  const errors = validate(fields);
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors,
      values: fields,
    };
  }

  try {
    await deliver(fields);
  } catch (error) {
    console.error("[contact] failed to deliver submission", error);
    return {
      status: "error",
      message: "Something went wrong sending that. Please try again in a moment.",
      values: fields,
    };
  }

  return {
    status: "success",
    message: "Thanks — your message is on its way. I'll reply by email.",
  };
}
