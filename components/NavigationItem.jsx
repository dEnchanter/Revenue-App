import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function NavigationItem({ href, iconSrc, alt, label, disabled }) {

  const pathname = usePathname();

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!pathname || disabled) return;

    setActive(pathname === href);
  }, [pathname, disabled]);

  if (disabled) {
    return (
      <div className="chatRow hover:cursor-not-allowed">
        <div>
          <Image src={iconSrc} alt={alt} width="20" height="20" className="object-contain" />
        </div>
        <div className="flex-1">
          <p className="text-[#A0A0A0] text-sm font-bold">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <Link href={href} className={`chatRow ${active ? 'bg-[#189FB8]/30' : ''}`}>
        <div>
          <Image src={iconSrc} alt={alt} width="20" height="20" className="object-contain" />
        </div>
        <div className="flex-1">
          <p className="text-[#095D52] text-sm font-bold">{label}</p>
        </div>
    </Link>
  );
}