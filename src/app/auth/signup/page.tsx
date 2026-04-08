import { SignUpForm } from './SignUpForm'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-fade-up">
        <div className="border border-border p-8 md:p-16 bg-background">
          <div className="mb-12">
            <span className="inline-block mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">New Account</span>
            <h1 className="font-syne font-black text-4xl md:text-6xl text-foreground tracking-tight uppercase">Join Archive</h1>
            <p className="font-cormorant text-xl text-text-muted italic mt-2">
              Create a member profile to sync your reading history.
            </p>
          </div>
          <SignUpForm />
          
          <div className="relative flex items-center justify-center my-12">
            <div className="absolute inset-x-0 h-px bg-border" />
            <span className="relative bg-background px-6 text-[9px] font-bold text-text-muted uppercase tracking-widest italic">Already a member?</span>
          </div>

          <Link href="/auth/signin" className="btn-secondary w-full py-5 transition-all">
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  )
}
