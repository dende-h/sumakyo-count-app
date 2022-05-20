import { atom } from "recoil";

const initialDigitalSupportNameArray = [
	"マイナンバーカード申請講座",
	"マイナポータル講座",
	"マイナポイント予約・申込講座",
	"オンライン診療講座",
	"ワクチンパスポート発行講座",
	"ワクチン接種WEB申し込み",
	"デジタル活用操作相談会"
];

export const digitalSupportEventArray = atom({
	key: "digitalSupportEventArray",
	default: initialDigitalSupportNameArray
});
