import CryptoJS from "crypto-js";

// ファイルのMD5ハッシュ値を計算する関数のみエクスポート
export const calculateMD5Hash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(buffer);
  return CryptoJS.MD5(wordArray).toString();
};
