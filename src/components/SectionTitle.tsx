import { ReactNode } from "react";

type Props = { children: ReactNode; red?: boolean };

export const SectionTitle = ({ children, red }: Props) => (
  <div className={`text-xs tracking-[0.35em] uppercase ${red ? "text-red-600" : "text-zinc-500"}`}>
    {children}
  </div>
);
