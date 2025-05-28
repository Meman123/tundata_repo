// components/Header/index.tsx
import Image from 'next/image';
import { forwardRef } from 'react';
import styles from './Header.module.css';

const Header = forwardRef<HTMLElement>((_, ref) => (
  <header ref={ref} className={styles.header}>
    <Image
      src="/LogoTundata.png"
      alt="Logo de Tundata"
      width={542} /* valor máximo de placeholder */
      height={142} /* mantén proporción original */
      priority
      className={styles.logo}
    />
  </header>
));

Header.displayName = 'Header';
export default Header;
