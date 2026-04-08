import { SignUpForm } from './SignUpForm'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-up">
        <div className="bg-surface/30 backdrop-blur-xl border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-accent/20 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M8 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6"/></svg>
            </div>
            <h1 className="font-syne font-black text-3xl text-white mb-2 tracking-tight">Create account</h1>
            <p className="text-text-muted text-sm font-medium">
              Join our community and sync your reading journey.
            </p>
          </div>
          <SignUpForm />
          
          <div className="relative flex items-center justify-center my-8">
            <div className="absolute inset-x-0 h-px bg-white/5" />
            <span className="relative bg-[#121214] px-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Already a member?</span>
          </div>

          <Link href="/auth/signin" className="btn-secondary w-full py-4 text-sm uppercase tracking-widest transition-all">
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  )
}
