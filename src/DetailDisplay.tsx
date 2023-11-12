import { ClipboardItem } from "./App";

function DetailDisplay({
  selectedItem,
}: {
  selectedItem: ClipboardItem | null;
}) {
  return (
    <div className="p-4">
      <div className="border p-2">
        {selectedItem ? selectedItem.content : "选择一条记录以查看详情"}
      </div>
      <div>{selectedItem?.timestamp}</div>
    </div>
  );
}

export default DetailDisplay;
