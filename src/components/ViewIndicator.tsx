type Props = {
  items: { id: string; label: string }[];
  activeId: string;
};

export const ViewIndicator = ({ items, activeId }: Props) => {
  if (items.length <= 1) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-500">
      <span>PAINÉIS:</span>
      {items.map((item) => (
        <span
          key={item.id}
          className={`px-2 py-1 rounded-full border ${
            item.id === activeId ? "border-emerald-500 text-emerald-500" : "border-zinc-800 text-zinc-500"
          }`}
        >
          {item.label.toUpperCase()}
        </span>
      ))}
    </div>
  );
};
