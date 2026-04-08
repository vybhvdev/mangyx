import { SignInForm } from './SignInForm'

export default function SignInPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-up">
        <div className="bg-surface/30 backdrop-blur-xl border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-accent/20 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg>
            </div>
            <h1 className="font-syne font-black text-3xl text-white mb-2 tracking-tight">Welcome back</h1>
            <p className="text-text-muted text-sm font-medium">
              Access your personalized library and reading progress.
            </p>
          </div>
          <SignInForm />
        </div>
      </div>
    </div>
  )
}
