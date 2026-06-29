// components/ui/CategoryTitle.tsx

interface Props {
  category: string; // "Games" | "Tools"
  title: string; // "IroGuesser" | "HTML Preview" など
}

export default function CategoryTitle({ category, title }: Props) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[7px] tracking-[0.5em] text-[#bbb] uppercase">
        {category}
      </p>
      <h1 className="text-xs tracking-[0.25em] text-[#1a1a1a] font-light">
        {title}
      </h1>
    </div>
  );
}
