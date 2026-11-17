import { Link } from 'react-router-dom';
const logoUrl = '/fly-away-logo.png';
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <img className="auth-logo" src={logoUrl} alt="Fly Away Travel" style={{ width: size * 2.6 }} />
  );
}
export function Logo() {
  return (
    <Link to="/" className="brand" aria-label="Fly Away Travel, ir al inicio">
      <img className="brand-logo" src={logoUrl} alt="Fly Away Travel" />
    </Link>
  );
}
