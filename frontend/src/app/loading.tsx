export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-brand-accent" />
        <p className="text-sm text-white/60">加载中...</p>
      </div>
    </div>
  )
}
