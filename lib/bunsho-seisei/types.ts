// lib/bunsho-seisei/types.ts
export type ChainOrder = 1 | 2 | 3;

// 次数（1〜N）ごとの連鎖表をまとめて持つ型（バックオフ方式用）
export type OrderedTables = Record<number, Record<string, string[]>>;

export interface MarkovTable {
  order: ChainOrder;
  tables: OrderedTables;
  startKeys: string[]; // 文頭（文章の先頭 or 「。！？」の直後）から始まるN文字の候補
}

// 質問への「それっぽい返答」を表す型
export interface QuestionReply {
  matched: string | null; // 質問文の中から見つかった手がかりの文字列（見つからなければnull）
  body: string; // 生成された返答本文
}
