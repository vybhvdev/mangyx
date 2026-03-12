import { SignInForm } from './SignInForm'

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-8 py-12">
      <div className="w-full max-w-[380px] animate-fade-up">
        <h1 className="font-syne font-black text-[2.5rem] mb-2">Welcome back.</h1>
        <p className="font-cormorant text-ink-500 text-base mb-8">
          Sign in to sync your library across devices.
        </p>
        <SignInForm />
      </div>
    </div>
  )
}
