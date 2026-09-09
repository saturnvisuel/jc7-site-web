"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepDefinition {
  title: string;
  description?: string;
}

interface FormStepperProps {
  steps: StepDefinition[];
  current: number;
  /** Permet de revenir sur une étape déjà validée. */
  onStepClick?: (index: number) => void;
}

export function FormStepper({ steps, current, onStepClick }: FormStepperProps) {
  const progress = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 100;

  return (
    <div className="mb-8">
      {/* Version mobile : compteur + barre */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-baseline justify-between">
          <p className="text-sm font-semibold text-gray-900">{steps[current]?.title}</p>
          <p className="text-xs text-muted-foreground">
            Étape {current + 1} / {steps.length}
          </p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-red-600 transition-all duration-500"
            style={{ width: `${((current + 1) / steps.length) * 100}%` }}
          />
        </div>
        {steps[current]?.description && (
          <p className="mt-2 text-xs text-muted-foreground">{steps[current].description}</p>
        )}
      </div>

      {/* Version desktop : cercles reliés */}
      <div className="hidden sm:block">
        <div className="relative">
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200" aria-hidden="true">
            <div
              className="h-full bg-red-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <ol className="relative flex justify-between">
            {steps.map((step, index) => {
              const isDone = index < current;
              const isCurrent = index === current;
              const canNavigate = Boolean(onStepClick) && isDone;

              return (
                <li key={step.title} className="flex flex-col items-center text-center">
                  <button
                    type="button"
                    disabled={!canNavigate}
                    onClick={() => canNavigate && onStepClick?.(index)}
                    aria-current={isCurrent ? "step" : undefined}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white text-sm font-bold transition-all",
                      isDone && "border-red-600 bg-red-600 text-white",
                      isCurrent && "border-red-600 text-red-600 ring-4 ring-red-100",
                      !isDone && !isCurrent && "border-gray-300 text-gray-400",
                      canNavigate && "cursor-pointer hover:scale-110"
                    )}
                  >
                    {isDone ? <Check className="h-5 w-5" /> : index + 1}
                  </button>
                  <span
                    className={cn(
                      "mt-2 max-w-[8rem] text-xs font-medium",
                      isCurrent ? "text-gray-900" : "text-gray-500"
                    )}
                  >
                    {step.title}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
