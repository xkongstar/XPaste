import { ClipboardItem } from "./App";
interface ClipboardListProps {
  items: ClipboardItem[];
  onSelect: (item: ClipboardItem) => void;
}

function ClipboardList({ items, onSelect }: ClipboardListProps) {
  return (
    <div className="overflow-auto h-[calc(100vh-100px)]">
      {items.map((item) => (
        <div
          key={item.uniqueItemId}
          className="p-2 border-b cursor-pointer text-neutral-950 truncate ..."
          onClick={() => onSelect(item)}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

export default ClipboardList;
