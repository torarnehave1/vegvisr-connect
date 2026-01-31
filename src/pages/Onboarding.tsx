import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import StepIndicator from '../components/StepIndicator';
import onboardingSteps from '../data/onboarding-steps.json';
import { clearStoredEmail, getStoredEmail, setStoredEmail } from '../lib/storage';
import {
  loadOnboardingReview,
  loadProgress,
  saveProgress,
  submitOnboarding,
  updateOnboardingReview
} from '../lib/api';
import { interestsSchema, learningSchema, personalSchema } from '../lib/validation';

const emptyData = {
  name: '',
  age: '',
  education: '',
  employment: '',
  location: '',
  motivation: '',
  experience: '',
  time: '',
  preferences: '',
  interests: [] as string[],
  momentumInterest: false
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reviewToken = searchParams.get('token') || searchParams.get('reviewToken') || '';
  const [email, setEmail] = useState(() => getStoredEmail());
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(emptyData);
  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const saveTimer = useRef<number | null>(null);

  const topics = onboardingSteps.topics;
  const motivationOptions = onboardingSteps.onboarding.learning.motivationOptions;
  const experienceOptions = onboardingSteps.onboarding.learning.experienceOptions;
  const timeOptions = onboardingSteps.onboarding.learning.timeOptions;
  const preferencesOptions = onboardingSteps.onboarding.learning.preferencesOptions;
  const totalSteps = 3;

  const canGoNext = useMemo(() => {
    if (step === 1) {
      return personalSchema.safeParse(formData).success;
    }
    if (step === 2) {
      return learningSchema.safeParse(formData).success;
    }
    return interestsSchema.safeParse(formData).success;
  }, [formData, step]);

  useEffect(() => {
    if (!email && !reviewToken) {
      navigate('/');
      return;
    }

    const run = async () => {
      try {
        if (reviewToken) {
          const review = await loadOnboardingReview(reviewToken);
          setStoredEmail(review.email);
          setEmail(review.email);
          setStep(1);
          setFormData({ ...emptyData, ...review.data });
        } else if (email) {
          const progress = await loadProgress(email);
          if (progress) {
            setStep(progress.step);
            setFormData({ ...emptyData, ...progress.data });
          }
        }
      } catch (err) {
        setError('Unable to load saved progress.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [email, navigate, reviewToken]);

  useEffect(() => {
    if (!email || loading || submitted || submitting) {
      return;
    }

    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }

    saveTimer.current = window.setTimeout(async () => {
      try {
        setSavingState('saving');
        await saveProgress(email, { step, data: formData });
        setSavingState('saved');
      } catch (err) {
        setSavingState('idle');
      }
    }, 500);

    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
      }
    };
  }, [email, formData, loading, step, submitted]);

  const handleChange = (field: keyof typeof emptyData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (topic: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(topic);
      const next = exists
        ? prev.interests.filter((item) => item !== topic)
        : [...prev.interests, topic];
      return { ...prev, interests: next };
    });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!email) {
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      if (reviewToken) {
        await updateOnboardingReview(reviewToken, formData);
      } else {
        await submitOnboarding(email, formData);
      }
      setSubmitted(true);
    } catch (err) {
      setError('Submission failed. Please try again.');
      setSubmitting(false);
    }
  };

  const renderSingleChoice = (field: keyof typeof emptyData, options: string[]) => {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => {
          const selected = formData[field] === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleChange(field, option)}
              disabled={submitting}
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                selected
                  ? 'border-white/70 bg-white/25 text-white'
                  : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mx-auto mt-32 max-w-lg rounded-3xl bg-white/10 p-8 text-white shadow-glass">
        {onboardingSteps.common.loading}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto mt-24 max-w-xl rounded-3xl bg-white/10 p-10 text-white shadow-glass">
        <CheckCircle2 className="h-12 w-12 text-emerald-300" />
        <h2 className="mt-4 text-3xl font-semibold">{onboardingSteps.onboarding.successTitle}</h2>
        <p className="mt-3 text-white/70">{onboardingSteps.onboarding.successBody}</p>
        <p className="mt-4 text-sm text-white/60">{onboardingSteps.onboarding.successMomentum}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 text-white">
      <div className="glass rounded-3xl p-8 shadow-glass">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{onboardingSteps.onboarding.title}</h1>
            <p className="text-sm text-white/70">{onboardingSteps.common.autosaveHint}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              clearStoredEmail();
              setEmail('');
              navigate('/');
            }}
            className="text-xs font-semibold uppercase tracking-widest text-white/60 hover:text-white"
          >
            {onboardingSteps.common.signOut}
          </button>
        </div>
        <div className="mt-6">
          <StepIndicator
            current={step}
            total={totalSteps}
            label={`${onboardingSteps.common.stepLabel} ${step} ${onboardingSteps.common.ofLabel} ${totalSteps}`}
          />
        </div>
      </div>

      <div className="glass rounded-3xl p-8 shadow-glass">
        {step === 1 && (
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="text-white/80">{onboardingSteps.onboarding.questions.name}</span>
              <input
                value={formData.name}
                onChange={(event) => handleChange('name', event.target.value)}
                disabled={submitting}
                className="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-white"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-white/80">{onboardingSteps.onboarding.questions.age}</span>
              <input
                value={formData.age}
                onChange={(event) => handleChange('age', event.target.value)}
                disabled={submitting}
                className="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-white"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-white/80">{onboardingSteps.onboarding.questions.education}</span>
              <input
                value={formData.education}
                onChange={(event) => handleChange('education', event.target.value)}
                disabled={submitting}
                className="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-white"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-white/80">{onboardingSteps.onboarding.questions.employment}</span>
              <input
                value={formData.employment}
                onChange={(event) => handleChange('employment', event.target.value)}
                disabled={submitting}
                className="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-white"
              />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
              <span className="text-white/80">{onboardingSteps.onboarding.questions.location}</span>
              <input
                value={formData.location}
                onChange={(event) => handleChange('location', event.target.value)}
                disabled={submitting}
                className="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-white"
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-8">
            <div className="space-y-3 text-sm">
              <div className="space-y-1">
                <span className="text-white/80">{onboardingSteps.onboarding.learning.motivation}</span>
                <p className="text-xs text-white/60">{onboardingSteps.onboarding.learning.motivationHelp}</p>
              </div>
              {renderSingleChoice('motivation', motivationOptions)}
              <textarea
                rows={2}
                value={formData.motivation}
                onChange={(event) => handleChange('motivation', event.target.value)}
                disabled={submitting}
                placeholder={onboardingSteps.onboarding.learning.detailPrompt}
                className="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-3 text-sm">
              <div className="space-y-1">
                <span className="text-white/80">{onboardingSteps.onboarding.learning.experience}</span>
                <p className="text-xs text-white/60">{onboardingSteps.onboarding.learning.experienceHelp}</p>
              </div>
              {renderSingleChoice('experience', experienceOptions)}
              <textarea
                rows={2}
                value={formData.experience}
                onChange={(event) => handleChange('experience', event.target.value)}
                disabled={submitting}
                placeholder={onboardingSteps.onboarding.learning.detailPrompt}
                className="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-white"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3 text-sm">
                <div className="space-y-1">
                  <span className="text-white/80">{onboardingSteps.onboarding.learning.time}</span>
                  <p className="text-xs text-white/60">{onboardingSteps.onboarding.learning.timeHelp}</p>
                </div>
                {renderSingleChoice('time', timeOptions)}
              </div>
              <div className="space-y-3 text-sm">
                <div className="space-y-1">
                  <span className="text-white/80">{onboardingSteps.onboarding.learning.preferences}</span>
                  <p className="text-xs text-white/60">{onboardingSteps.onboarding.learning.preferencesHelp}</p>
                </div>
                {renderSingleChoice('preferences', preferencesOptions)}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold">{onboardingSteps.onboarding.interests.title}</h2>
            <p className="mt-2 text-sm text-white/70">
              {onboardingSteps.onboarding.interests.description}
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {topics.map((topic) => {
                const selected = formData.interests.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleInterest(topic)}
                    disabled={submitting}
                    className={`rounded-2xl border px-3 py-4 text-sm transition ${
                      selected
                        ? 'border-white/70 bg-white/30 text-white'
                        : 'border-white/20 bg-white/10 text-white/70 hover:border-white/40'
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
            <div className="mt-8 rounded-2xl border border-white/20 bg-white/5 p-4">
              <label className="flex items-start gap-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={formData.momentumInterest}
                  onChange={(event) => handleChange('momentumInterest', event.target.checked)}
                  disabled={submitting}
                  className="mt-1 h-4 w-4 rounded border-white/40 bg-white/10"
                />
                <span>
                  <span className="block font-semibold">{onboardingSteps.onboarding.momentum.label}</span>
                  <span className="block text-xs text-white/60">
                    {onboardingSteps.onboarding.momentum.description}
                  </span>
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-white/5 px-6 py-4 text-sm text-white/70 md:flex-row">
        <div>
          {savingState === 'saving' && onboardingSteps.common.saving}
          {savingState === 'saved' && onboardingSteps.common.saved}
        </div>
        <div className="flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="rounded-full border border-white/30 px-4 py-2 text-white/80 hover:bg-white/10"
            >
              {onboardingSteps.common.back}
            </button>
          )}
          {step < totalSteps && (
            <button
              type="button"
              disabled={!canGoNext || submitting}
              onClick={handleNext}
              className="rounded-full bg-white px-4 py-2 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {onboardingSteps.common.next}
            </button>
          )}
          {step === totalSteps && (
            <button
              type="button"
              disabled={!canGoNext || submitting}
              onClick={handleSubmit}
              className="rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {onboardingSteps.common.submit}
            </button>
          )}
        </div>
        {error && <div className="text-rose-200">{error}</div>}
      </div>
    </div>
  );
};

export default Onboarding;
