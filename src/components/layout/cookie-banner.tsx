"use client";

import { Button, Modal, Switch, toast } from "@heroui/react";
import { Cookie } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { useConsent, useHydrated } from "@/store";
import { LocaleLink } from "../ui/locale-link";

function PreferenceRow({
  title,
  text,
  checked,
  onChange,
  locked,
  lockedLabel,
}: {
  title: string;
  text: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  locked?: boolean;
  lockedLabel?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-4">
      <div>
        <p className="font-semibold text-ink-900">{title}</p>
        <p className="mt-1 text-sm text-muted">{text}</p>
      </div>
      {locked ? (
        <span className="shrink-0 rounded-full bg-evergreen-50 px-2.5 py-1 text-xs font-semibold text-evergreen-700">{lockedLabel}</span>
      ) : (
        <Switch isSelected={checked} onChange={onChange} aria-label={title} className="shrink-0">
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch>
      )}
    </div>
  );
}

export function CookieBanner() {
  const { t } = useI18n();
  const hydrated = useHydrated();
  const consent = useConsent((s) => s.consent);
  const prefsOpen = useConsent((s) => s.prefsOpen);
  const decide = useConsent((s) => s.decide);
  const openPrefs = useConsent((s) => s.openPrefs);
  const [analytics, setAnalytics] = useState(consent?.analytics ?? true);
  const [marketing, setMarketing] = useState(consent?.marketing ?? false);

  const showBanner = hydrated && !consent && !prefsOpen;

  function openCustomize() {
    setAnalytics(consent?.analytics ?? true);
    setMarketing(consent?.marketing ?? false);
    openPrefs(true);
  }

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            role="region"
            aria-label={t.cookies.prefsTitle}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.6 }}
            className="fixed inset-x-3 bottom-3 z-[60] sm:right-auto sm:bottom-5 sm:left-5 sm:max-w-md"
          >
            <div className="paper-grain rounded-3xl border border-border bg-cream-50 p-5 shadow-[0_24px_60px_-20px_rgba(40,25,10,0.45)]">
              <div className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gold-100 text-gold-700">
                  <Cookie className="size-5" />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold text-ink-900">{t.cookies.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">
                    {t.cookies.text}{" "}
                    <LocaleLink href="/legal/cookies" className="font-semibold text-cranberry-700 underline underline-offset-2">
                      {t.cookies.policy}
                    </LocaleLink>
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" className="rounded-full" onPress={() => decide({ analytics: true, marketing: true })}>
                  {t.cookies.accept}
                </Button>
                <Button size="sm" variant="outline" className="rounded-full" onPress={() => decide({ analytics: false, marketing: false })}>
                  {t.cookies.reject}
                </Button>
                <Button size="sm" variant="ghost" className="rounded-full" onPress={openCustomize}>
                  {t.cookies.customize}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal.Backdrop isOpen={prefsOpen} onOpenChange={openPrefs}>
        <Modal.Container placement="center">
          <Modal.Dialog className="sm:max-w-lg">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-gold-100 text-gold-700">
                <Cookie className="size-5" />
              </Modal.Icon>
              <Modal.Heading>{t.cookies.prefsTitle}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-3">
              <p className="text-sm text-muted">{t.cookies.prefsText}</p>
              <PreferenceRow title={t.cookies.necessary.title} text={t.cookies.necessary.text} checked locked lockedLabel={t.cookies.always} />
              <PreferenceRow title={t.cookies.analytics.title} text={t.cookies.analytics.text} checked={analytics} onChange={setAnalytics} />
              <PreferenceRow title={t.cookies.marketing.title} text={t.cookies.marketing.text} checked={marketing} onChange={setMarketing} />
            </Modal.Body>
            <Modal.Footer className="flex-wrap">
              <Button variant="outline" className="rounded-full" onPress={() => decide({ analytics: false, marketing: false })}>
                {t.cookies.reject}
              </Button>
              <Button
                className="rounded-full"
                onPress={() => {
                  decide({ analytics, marketing });
                  toast.success(t.cookies.saved);
                }}
              >
                {t.cookies.save}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
