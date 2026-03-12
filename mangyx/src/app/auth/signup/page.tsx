import { SignUpForm } from './SignUpForm'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-8 py-12">
      <div className="w-full max-w-[380px] animate-fade-up">
        <h1 className="font-syne font-black text-[2.5rem] mb-2">Join Mangyx.</h1>
        <p className="font-cormorant text-ink-500 text-base mb-8">
          Create an account to save your library and track your reading.
        </p>
        <SignUpForm />
        <p className="text-center font-cormorant text-[0.9rem] text-ink-500 mt-6">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-onyx underline underline-offset-2">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
