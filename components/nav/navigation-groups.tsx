import Link from "@/components/site/site-link";
import { ArrowUpRight, CarFront, Users, HeartHandshake } from "@/components/site/icons";
import type { SVGProps } from "react";
import type { NavigationItem } from "@/lib/luzik-navigation";

function MotorcycleIcon({ size = 20, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="5" cy="17" r="3.5" /><circle cx="19" cy="17" r="3.5" /><path d="m19 17-5-12h-3m4 3h4M5 17l5-8 5 8H5Zm2-8h4M10 9l3 4" /></svg>;
}

const icons = { car: CarFront, bike: MotorcycleIcon, help: HeartHandshake, school: Users };

export function NavigationVehicleIcon({ vehicle, size = 20 }: { vehicle: "car" | "bike"; size?: number }) {
  const Icon = icons[vehicle];
  return <Icon size={size} aria-hidden="true" />;
}

export function NavigationGroups({ item, pathname, onNavigate }: {
  item: NavigationItem;
  pathname?: string;
  onNavigate?: () => void;
}) {
  const groups = item.groups ?? [{ label: "Poznaj Luzik", icon: "school" as const, links: item.children ?? [] }];

  return <div className="luzik-nav-groups">
    {groups.map(group => {
      const Icon = icons[group.icon];
      return <section key={group.label} className="luzik-nav-group" data-vehicle={group.icon}>
        <h3>{group.label}</h3>
        <ul>
          {group.links.map(link => <li key={link.href}>
            <Link href={link.href} onClick={onNavigate} aria-current={pathname === link.href ? "page" : undefined} className="luzik-nav-card">
              <span className="luzik-nav-card-icon"><Icon size={20} aria-hidden="true" /></span>
              <span className="luzik-nav-card-copy"><strong>{link.label}</strong>{link.description && <span>{link.description}</span>}</span>
              <ArrowUpRight size={15} className="luzik-nav-card-arrow" aria-hidden="true" />
            </Link>
          </li>)}
        </ul>
      </section>;
    })}
  </div>;
}
