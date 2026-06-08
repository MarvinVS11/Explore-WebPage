import useSiteConfig from '../hooks/useSiteConfig';
import { getImageUrl } from '../api';

export default function Footer() {
  const { config, navLinks } = useSiteConfig();

  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-brand">
          {config?.logoUrl
            ? <img src={getImageUrl(config.logoUrl)} alt={config?.siteName} className="footer-logo" />
            : <span>{config?.siteName || 'Fundación Bosque Nuboso de Occidente'}</span>
          }
        </div>

        <ul className="footer-links">
          {navLinks.map(link => (
            <li key={link._id}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        <div className="footer-redes">
          {config?.whatsappUrl && (
            <a href={config.whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <img src={getImageUrl(config.whatsappImgUrl)} alt="WhatsApp" />
            </a>
          )}
          {config?.facebookUrl && (
            <a href={config.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook">
              <img src={getImageUrl(config.facebookImgUrl)} alt="Facebook" />
            </a>
          )}
          {config?.instagramUrl && (
            <a href={config.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
              <img src={getImageUrl(config.instagramImgUrl)} alt="Instagram" />
            </a>
          )}
        </div>

        <p className="footer-copy">
          {config?.footerCopyright || '© 2025 Fundación Bosque Nuboso de Occidente'}
        </p>

      </div>
    </footer>
  );
}
