import { cn } from "@/lib/utils"

type Option<T extends string> = {
  value: T
  label: string
  hint?: string
}

export function ChoiceChips<T extends string>({
  value,
  onChange,
  options,
  columns = 2,
}: {
  value: T
  onChange: (value: T) => void
  options: Option<T>[]
  columns?: 2 | 3 | 4
}) {
  return (
    <div
      className={cn(
        "grid gap-2",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
        columns === 4 && "grid-cols-2 sm:grid-cols-4"
      )}
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-12 rounded-2xl border px-3 py-2.5 text-left transition-colors",
              selected
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-foreground hover:bg-secondary"
            )}
          >
            <span className="block text-sm font-semibold">{option.label}</span>
            {option.hint ? (
              <span
                className={cn(
                  "mt-0.5 block text-xs",
                  selected ? "text-primary-foreground/80" : "text-muted-foreground"
                )}
              >
                {option.hint}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
