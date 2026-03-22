interface DiffSegments {
  prefix: string
  changed: string
  suffix: string
}

interface ContentDiffPanelProps {
  draftZh?: string | null
  draftEn?: string | null
  publishedZh?: string | null
  publishedEn?: string | null
}

function getDiffSegments(currentValue: string, comparisonValue: string): DiffSegments {
  if (currentValue === comparisonValue) {
    return {
      prefix: currentValue,
      changed: '',
      suffix: '',
    }
  }

  let prefixLength = 0
  const minLength = Math.min(currentValue.length, comparisonValue.length)
  while (prefixLength < minLength && currentValue[prefixLength] === comparisonValue[prefixLength]) {
    prefixLength += 1
  }

  let suffixLength = 0
  while (
    suffixLength < currentValue.length - prefixLength &&
    suffixLength < comparisonValue.length - prefixLength &&
    currentValue[currentValue.length - 1 - suffixLength] === comparisonValue[comparisonValue.length - 1 - suffixLength]
  ) {
    suffixLength += 1
  }

  return {
    prefix: currentValue.slice(0, prefixLength),
    changed: currentValue.slice(prefixLength, currentValue.length - suffixLength),
    suffix: currentValue.slice(currentValue.length - suffixLength),
  }
}

function renderDiffText(value: string, comparisonValue: string, changedClassName: string, emptyLabel: string) {
  if (!value) {
    return <span className="text-gray-400">{emptyLabel}</span>
  }

  const segments = getDiffSegments(value, comparisonValue)
  return (
    <>
      {segments.prefix}
      {segments.changed && <mark className={changedClassName}>{segments.changed}</mark>}
      {segments.suffix}
    </>
  )
}

export function ContentDiffPanel({
  draftZh,
  draftEn,
  publishedZh,
  publishedEn,
}: ContentDiffPanelProps) {
  const normalizedDraftZh = draftZh ?? ''
  const normalizedDraftEn = draftEn ?? ''
  const normalizedPublishedZh = publishedZh ?? ''
  const normalizedPublishedEn = publishedEn ?? ''

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
        <p className="text-xs font-medium text-amber-800 mb-2">Current Draft</p>
        <div className="space-y-2 text-xs text-amber-900">
          <div>
            <p className="font-medium mb-1">中文</p>
            <p className="whitespace-pre-wrap break-words leading-5">
              {renderDiffText(normalizedDraftZh, normalizedPublishedZh, 'rounded bg-amber-200 px-0.5', '未填写')}
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">English</p>
            <p className="whitespace-pre-wrap break-words leading-5">
              {renderDiffText(normalizedDraftEn, normalizedPublishedEn, 'rounded bg-amber-200 px-0.5', 'Not filled')}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
        <p className="text-xs font-medium text-emerald-800 mb-2">Published Version</p>
        <div className="space-y-2 text-xs text-emerald-900">
          <div>
            <p className="font-medium mb-1">中文</p>
            <p className="whitespace-pre-wrap break-words leading-5">
              {renderDiffText(normalizedPublishedZh, normalizedDraftZh, 'rounded bg-emerald-200 px-0.5', '未发布')}
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">English</p>
            <p className="whitespace-pre-wrap break-words leading-5">
              {renderDiffText(normalizedPublishedEn, normalizedDraftEn, 'rounded bg-emerald-200 px-0.5', 'Not published')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentDiffPanel
