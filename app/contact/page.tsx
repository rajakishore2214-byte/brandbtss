"use client";

import React, { useState } from "react";
import { Mail, MapPin, Send, CheckCircle2, Loader2, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [messageText, setMessageText] = useState("");
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !messageText) {
      setStatus("error");
      setResponseMsg("Please fill out all required fields.");
      return;
    }

    if (!email.includes("@")) {
      setStatus("error");
      setResponseMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    // Simulate contact form submission API
    setTimeout(() => {
      setStatus("success");
      setResponseMsg("Thank you! Your message has been sent to our editorial desk. We will respond within 48 hours.");
      setName("");
      setEmail("");
      setSubject("");
      setMessageText("");
    }, 1200);
  };

  return (
    <div className="pb-16 space-y-12">
      {/* Header Hero */}
      <section className="bg-slate-900 text-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-text">
            Get In Touch
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Contact BrandBTSS
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Have a product you want us to review? Found a broken deal or coupon? Drop our editorial desk a message.
          </p>
        </div>
      </section>

      {/* Grid Layout Container */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 grid md:grid-cols-5 gap-12 items-start">
        
        {/* Contact info links (2 cols) */}
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Contact Information</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              We respond to all reader questions, media inquiries, and technical feedback.
            </p>
          </div>

          <div className="space-y-6 text-sm text-slate-700">
            {/* Email */}
            <div className="flex gap-4">
              <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5 text-primary shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <strong className="text-slate-900 block font-semibold text-xs sm:text-sm">Editorial Desk</strong>
                <a href="mailto:editor@brandbtss.com" className="text-primary hover:text-primary-hover transition-colors text-xs sm:text-sm">
                  editor@brandbtss.com
                </a>
              </div>
            </div>

            {/* Support */}
            <div className="flex gap-4">
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-2.5 text-amber-600 shrink-0">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <strong className="text-slate-900 block font-semibold text-xs sm:text-sm">Partnerships & Advertising</strong>
                <a href="mailto:partners@brandbtss.com" className="text-primary hover:text-primary-hover transition-colors text-xs sm:text-sm">
                  partners@brandbtss.com
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-4">
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-amber-500 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <strong className="text-slate-900 block font-semibold text-xs sm:text-sm">Office Location</strong>
                <p className="text-slate-500 leading-relaxed mt-0.5 text-xs sm:text-sm">
                  BrandBTSS Media Group,<br />
                  DLF CyberCity, Phase 3,<br />
                  Gurugram, HR 122002, India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (3 cols) */}
        <div className="md:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {status === "success" ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Message Sent Successfully!</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                {responseMsg}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-slate-950 mb-2">Send an Enquiry</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Your Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-primary focus:bg-white focus:outline-none"
                    disabled={status === "loading"}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Your Email <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-primary focus:bg-white focus:outline-none"
                    disabled={status === "loading"}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                <input
                  type="text"
                  placeholder="Review requests, deal report, etc."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-primary focus:bg-white focus:outline-none"
                  disabled={status === "loading"}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Message <span className="text-rose-500">*</span></label>
                <textarea
                  rows={4}
                  placeholder="Write message details..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-primary focus:bg-white focus:outline-none resize-none"
                  disabled={status === "loading"}
                  required
                />
              </div>

              {status === "error" && (
                <p className="text-xs text-rose-500 font-medium">{responseMsg}</p>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-hover py-3 text-center text-xs sm:text-sm font-bold text-primary-text transition-all active:scale-95 disabled:opacity-60"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Sending Message
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
