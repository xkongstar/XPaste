import { useEffect, useState } from "react";
import { clipboard } from "@tauri-apps/api";
import { v4 as uuidv4 } from "uuid";
import { ref, onValue, set } from "firebase/database";
import SearchBar from "./SearchBar";
import ClipboardList from "./ClipboardList";
import DetailDisplay from "./DetailDisplay";
import database from "./firebaseConfig";

import "./App.css";

export interface ClipboardItem {
  uniqueItemId: string;
  timestamp: string;
  type: string;
  content: string;
  // ...其他可能的字段
}

function generateUniqueId() {
  return uuidv4(); // 生成并返回一个新的UUID
}

function processClipboardData(text: string) {
  // 处理数据，如生成唯一ID，提取关键词等
  return {
    uniqueItemId: generateUniqueId(), // 生成唯一ID的函数
    timestamp: new Date().toISOString(),
    type: "text", // 或者其他类型，根据数据而定
    content: text,
    // ...其他需要的字段
  };
}

function uploadClipboardData(data: ClipboardItem) {
  const clipboardRef = ref(database, "clipboardItems/" + data.uniqueItemId);

  set(clipboardRef, data)
    .then(() => console.log("Data uploaded successfully."))
    .catch((error) => console.error("Error uploading data:", error));
}

let lastUploadedContent: string | null = null;

function App() {
  const [selectedItem, setSelectedItem] = useState<ClipboardItem | null>(null);
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([]);

  const appStyle = {
    background:
      "linear-gradient(45deg, #ff9a9e, #fad0c4, #fad0c4, #ffdde1, #ee9ca7, #ffdde1, #8675a9)",
    minHeight: "30vh",
    color: "white",
  };

  async function getClipboardText() {
    try {
      const text = await clipboard.readText();
      return text;
    } catch (e) {
      console.error(e);
    }
  }

  async function handleClipboardData() {
    const clipboardText = await getClipboardText(); // 假设这是读取剪切板的函数
    console.log("clipboardText:", clipboardText);

    if (clipboardText && clipboardText !== lastUploadedContent) {
      const data = processClipboardData(clipboardText);
      uploadClipboardData(data);
      lastUploadedContent = clipboardText;
    }
  }

  useEffect(() => {
    const clipboardItemsRef = ref(database, "clipboardItems");

    // 监听数据变化
    const unsubscribe = onValue(clipboardItemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // 转换对象为数组
        const itemsArray = Object.keys(data).map((key) => ({
          ...data[key],
          uniqueItemId: key,
        }));
        setClipboardItems(itemsArray);
      }
    });

    // 清理函数
    return () => unsubscribe();
  }, []);

  // 使用定时器定期调用 handleClipboardData
  useEffect(() => {
    const intervalId = setInterval(handleClipboardData, 5000); // 每5秒检查一次

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App p-8 bg-pink-100">
      <button onClick={handleClipboardData}>add</button>
      <div className="full rounded-lg" style={appStyle}>
        <SearchBar />
        <div className="flex">
          <div className="w-2/5 border-dotted border-2 border-cyan-300">
            <ClipboardList items={clipboardItems} onSelect={setSelectedItem} />
          </div>
          <div className="w-3/5">
            <DetailDisplay selectedItem={selectedItem} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
