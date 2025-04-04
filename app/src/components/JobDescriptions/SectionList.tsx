interface SectionListProps {
  items: string[];
}

const SectionList: React.FC<SectionListProps> = ({ items }) => (
  <ul className="space-y-3">
    {items.map((item, idx) => (
      <li
        key={idx}
        className="flex items-start gap-3 group hover:bg-gray-100 p-2 rounded-lg transition-colors"
      >
        <span className="h-2 w-2 rounded-full bg-indigo-500 mt-2 group-hover:bg-indigo-600 transition-colors" />
        <span className="text-base text-gray-900">{item}</span>
      </li>
    ))}
  </ul>
);

export default SectionList;
