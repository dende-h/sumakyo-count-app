import { atom } from "recoil";

const initialDigitalSupportNameArray = [
	"マイナンバーカード",
	"マイナポータル",
	"マイナポイント",
	"オンライン診療",
	"ワクチン証明書アプリ",
	"ワクチン接種予約",
	"操作相談"
];

export const digitalSupportEventArray = atom({
	key: "digitalSupportEventArray",
	default: initialDigitalSupportNameArray
});
