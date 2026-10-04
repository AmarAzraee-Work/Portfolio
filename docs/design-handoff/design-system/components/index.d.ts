import type * as React from 'react';

export type IconName = 'download' | 'arrow' | 'ext' | 'menu' | 'close' | 'lock' | 'alert' | 'check' | 'mail' | 'github';

export interface TagProps { children: React.ReactNode; className?: string }
export declare function Tag(props: TagProps): React.ReactElement;
export interface TagListProps { tags: string[]; label?: string }
export declare function TagList(props: TagListProps): React.ReactElement;

export interface StatusBadgeProps { status?: 'live' | 'demo' | 'open'; children?: React.ReactNode; className?: string }
export declare function StatusBadge(props: StatusBadgeProps): React.ReactElement;

export interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'sm';
  /** Renders <a> when set, otherwise <button>. */
  href?: string;
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
  icon?: IconName;
  iconRight?: IconName;
  type?: 'button' | 'submit';
  download?: boolean | string;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface SectionHeadingProps { title: string; index?: string; subtitle?: string; id?: string }
export declare function SectionHeading(props: SectionHeadingProps): React.ReactElement;

export interface BentoTileProps {
  children?: React.ReactNode;
  /** Mono uppercase label at the top of the tile. */
  eyebrow?: string;
  /** Grid placement class, e.g. "am-hero-intro". */
  className?: string;
  /** Makes the whole tile a link. */
  href?: string;
  ariaLabel?: string;
  /** Removes padding (photo tile). */
  flush?: boolean;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}
export declare function BentoTile(props: BentoTileProps): React.ReactElement;

export interface BrowserFrameProps { src?: string; alt?: string; title?: string; url?: string; mock?: boolean; className?: string }
export declare function BrowserFrame(props: BrowserFrameProps): React.ReactElement;
export interface PhoneFrameProps { src?: string; alt?: string }
export declare function PhoneFrame(props: PhoneFrameProps): React.ReactElement;

export interface ProjectRowProps {
  /** "01", "02"… */
  index: string;
  name: string;
  /** One plain-English sentence: the business problem it solves. */
  problem: string;
  /** A number or one sentence, e.g. "Used daily by 40 staff". */
  outcome?: string;
  tags: string[];
  status?: 'live' | 'demo';
  liveUrl?: string;
  /** Omit for private client work: shows "Private client code" instead. */
  githubUrl?: string | null;
  privateNote?: string;
  image?: string;
  imageAlt?: string;
  phoneImage?: string;
  featured?: boolean;
  /** Featured only: screenshot on the right. */
  reverse?: boolean;
  /** Draw an abstract wireframe when no screenshot (design comps only). */
  mock?: boolean;
  id?: string;
}
export declare function ProjectRow(props: ProjectRowProps): React.ReactElement;

export interface TimelineItemProps { role: string; company: string; period: string; bullets: string[]; tags?: string[]; current?: boolean }
export declare function TimelineItem(props: TimelineItemProps): React.ReactElement;

export interface CertItemProps { name: string; issuer: string; year: string | number; verifyUrl?: string }
export declare function CertItem(props: CertItemProps): React.ReactElement;

export interface ContactValues { name: string; email: string; message: string }
export interface ContactFormProps {
  onSubmit?: (values: ContactValues) => Promise<unknown> | void;
  idPrefix?: string;
  initialValues?: ContactValues;
  initialErrors?: Partial<Record<keyof ContactValues, string>>;
  initialStatus?: 'idle' | 'sending' | 'sent' | 'failed';
}
export declare function ContactForm(props: ContactFormProps): React.ReactElement;

export interface NavbarProps { name?: string; cvHref?: string; links?: { label: string; href: string }[]; defaultOpen?: boolean }
export declare function Navbar(props: NavbarProps): React.ReactElement;

export interface RevealProps { children?: React.ReactNode; as?: keyof JSX.IntrinsicElements; className?: string; id?: string }
/** Fades children in once on scroll; no motion under prefers-reduced-motion. */
export declare function Reveal(props: RevealProps): React.ReactElement;
