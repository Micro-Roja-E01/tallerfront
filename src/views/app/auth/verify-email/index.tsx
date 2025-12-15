import { VerifyEmailCard } from "./components";

interface Props {
  email?: string;
}

export default function VerifyEmailView({ email }: Props) {
  return (
    <div className="flex items-start justify-center min-h-screen pt-8">
      <VerifyEmailCard email={email} />
    </div>
  );
}
