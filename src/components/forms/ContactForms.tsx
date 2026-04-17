"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/cn";

type TabKey = "demo" | "booking" | "general";

export function ContactForms() {
  const t = useTranslations();
  const [tab, setTab] = useState<TabKey>("demo");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "demo", label: t("pages.contact.tabDemo") },
    { key: "booking", label: t("pages.contact.tabBooking") },
    { key: "general", label: t("pages.contact.tabGeneral") },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border">
        {tabs.map((ti) => (
          <button
            key={ti.key}
            onClick={() => setTab(ti.key)}
            className={cn(
              "px-5 py-3 text-sm transition-colors border-b-2 -mb-[2px]",
              tab === ti.key
                ? "border-accent text-fg"
                : "border-transparent text-fg-muted hover:text-fg"
            )}
          >
            {ti.label}
          </button>
        ))}
      </div>

      {tab === "demo" && <DemoForm />}
      {tab === "booking" && <BookingForm />}
      {tab === "general" && <GeneralForm />}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="eyebrow mb-2 block">{children}</label>;
}

function Input({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <>
      <input
        {...props}
        className={cn(
          "w-full bg-bg-elevated border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors",
          error ? "border-red-500/50" : "border-border focus:border-accent"
        )}
      />
      {error && <div className="text-xs text-red-400 mt-1">{error}</div>}
    </>
  );
}

function Textarea({
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <>
      <textarea
        {...props}
        rows={5}
        className={cn(
          "w-full bg-bg-elevated border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none",
          error ? "border-red-500/50" : "border-border focus:border-accent"
        )}
      />
      {error && <div className="text-xs text-red-400 mt-1">{error}</div>}
    </>
  );
}

function StatusMessage({
  state,
}: {
  state: "idle" | "submitting" | "success" | "error";
}) {
  const t = useTranslations("form");
  if (state === "success")
    return (
      <div className="mt-4 p-4 border border-accent/30 rounded-xl bg-accent/5 text-sm">
        {t("success")}
      </div>
    );
  if (state === "error")
    return (
      <div className="mt-4 p-4 border border-red-500/30 rounded-xl bg-red-500/5 text-sm text-red-300">
        {t("error")}
      </div>
    );
  return null;
}

function DemoForm() {
  const t = useTranslations("form");
  const schema = z.object({
    artistName: z.string().min(1, t("required")),
    email: z.string().email(t("invalidEmail")),
    link: z.string().url(t("invalidUrl")),
    message: z.string().min(1, t("required")),
  });
  type Data = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<Data>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: Data) => {
    await new Promise((r) => setTimeout(r, 800));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
      <div>
        <FieldLabel>{t("artistName")}</FieldLabel>
        <Input {...register("artistName")} error={errors.artistName?.message} />
      </div>
      <div>
        <FieldLabel>{t("email")}</FieldLabel>
        <Input type="email" {...register("email")} error={errors.email?.message} />
      </div>
      <div>
        <FieldLabel>{t("link")}</FieldLabel>
        <Input type="url" placeholder="https://..." {...register("link")} error={errors.link?.message} />
      </div>
      <div>
        <FieldLabel>{t("message")}</FieldLabel>
        <Textarea {...register("message")} error={errors.message?.message} />
      </div>
      <button type="submit" disabled={isSubmitting} className="btn btn-primary disabled:opacity-50">
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
      <StatusMessage state={isSubmitSuccessful ? "success" : isSubmitting ? "submitting" : "idle"} />
    </form>
  );
}

function BookingForm() {
  const t = useTranslations("form");
  const schema = z.object({
    name: z.string().min(1, t("required")),
    email: z.string().email(t("invalidEmail")),
    projectType: z.string().min(1, t("required")),
    preferredDate: z.string().min(1, t("required")),
    details: z.string().min(1, t("required")),
  });
  type Data = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<Data>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: Data) => {
    await new Promise((r) => setTimeout(r, 800));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <FieldLabel>{t("name")}</FieldLabel>
          <Input {...register("name")} error={errors.name?.message} />
        </div>
        <div>
          <FieldLabel>{t("email")}</FieldLabel>
          <Input type="email" {...register("email")} error={errors.email?.message} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <FieldLabel>{t("projectType")}</FieldLabel>
          <Input placeholder="Recording, Mix, Master…" {...register("projectType")} error={errors.projectType?.message} />
        </div>
        <div>
          <FieldLabel>{t("preferredDate")}</FieldLabel>
          <Input type="date" {...register("preferredDate")} error={errors.preferredDate?.message} />
        </div>
      </div>
      <div>
        <FieldLabel>{t("details")}</FieldLabel>
        <Textarea {...register("details")} error={errors.details?.message} />
      </div>
      <button type="submit" disabled={isSubmitting} className="btn btn-primary disabled:opacity-50">
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
      <StatusMessage state={isSubmitSuccessful ? "success" : isSubmitting ? "submitting" : "idle"} />
    </form>
  );
}

function GeneralForm() {
  const t = useTranslations("form");
  const schema = z.object({
    name: z.string().min(1, t("required")),
    email: z.string().email(t("invalidEmail")),
    subject: z.string().min(1, t("required")),
    message: z.string().min(1, t("required")),
  });
  type Data = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<Data>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: Data) => {
    await new Promise((r) => setTimeout(r, 800));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <FieldLabel>{t("name")}</FieldLabel>
          <Input {...register("name")} error={errors.name?.message} />
        </div>
        <div>
          <FieldLabel>{t("email")}</FieldLabel>
          <Input type="email" {...register("email")} error={errors.email?.message} />
        </div>
      </div>
      <div>
        <FieldLabel>{t("subject")}</FieldLabel>
        <Input {...register("subject")} error={errors.subject?.message} />
      </div>
      <div>
        <FieldLabel>{t("message")}</FieldLabel>
        <Textarea {...register("message")} error={errors.message?.message} />
      </div>
      <button type="submit" disabled={isSubmitting} className="btn btn-primary disabled:opacity-50">
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
      <StatusMessage state={isSubmitSuccessful ? "success" : isSubmitting ? "submitting" : "idle"} />
    </form>
  );
}
