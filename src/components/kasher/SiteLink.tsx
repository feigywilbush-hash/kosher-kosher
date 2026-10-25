import type { AnchorHTMLAttributes } from "react";
import { Link } from "react-router-dom";

/** In-page anchors ("#id") stay plain links; site paths ("/restaurants", "/#qa") go through the router. */
export function SiteLink({ to, ...props }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return to.startsWith("#") ? <a href={to} {...props} /> : <Link to={to} {...props} />;
}
