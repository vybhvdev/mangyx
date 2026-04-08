import { SignInForm } from './SignInForm'

export default function SignInPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-fade-up">
        <div className="border border-border p-8 md:p-16 bg-background">
          <div className="mb-12">
            <span className="inline-block mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">Member Portal</span>
            <h1 className="font-syne font-black text-4xl md:text-6xl text-foreground tracking-tight uppercase">Welcome Back</h1>
            <p className="font-cormorant text-xl text-text-muted italic mt-2">
              Sign in to access your collection and preferences.
            </p>
          </div>
          <SignInForm />
        </div>
      </div>
    </div>
  )
}
