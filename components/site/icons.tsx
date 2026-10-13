// Generated from the original Lucide paths by scripts/prepare-ui-icons.mjs.
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string; absoluteStrokeWidth?: boolean };
const sprite = '/luzik/ui-icons-725143fe1f06.svg';
function icon(name: string) {
  return function StaticIcon({ size = 24, color = 'currentColor', strokeWidth = 2, absoluteStrokeWidth = false, className = '', ...props }: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-${name} ${className}`} {...props}><use href={`${sprite}#${name}`} /></svg>;
  };
}
export const ArrowLeft = icon('arrow-left');
export const ArrowRight = icon('arrow-right');
export const ArrowUpRight = icon('arrow-up-right');
export const Award = icon('award');
export const BookOpen = icon('book-open');
export const CalendarDays = icon('calendar-days');
export const CarFront = icon('car-front');
export const Check = icon('check');
export const CheckCircle2 = icon('check-circle2');
export const ChevronDown = icon('chevron-down');
export const ChevronLeft = icon('chevron-left');
export const ChevronRight = icon('chevron-right');
export const ClipboardCheck = icon('clipboard-check');
export const Clock3 = icon('clock3');
export const Copy = icon('copy');
export const CreditCard = icon('credit-card');
export const Expand = icon('expand');
export const Facebook = icon('facebook');
export const HeartHandshake = icon('heart-handshake');
export const HeartPulse = icon('heart-pulse');
export const Instagram = icon('instagram');
export const Mail = icon('mail');
export const MapPin = icon('map-pin');
export const MessageCircle = icon('message-circle');
export const Navigation = icon('navigation');
export const Phone = icon('phone');
export const Quote = icon('quote');
export const Route = icon('route');
export const Search = icon('search');
export const Share2 = icon('share2');
export const ShieldCheck = icon('shield-check');
export const Star = icon('star');
export const Timer = icon('timer');
export const Trophy = icon('trophy');
export const UserRoundCheck = icon('user-round-check');
export const Users = icon('users');
export const WalletCards = icon('wallet-cards');
export const X = icon('x');
