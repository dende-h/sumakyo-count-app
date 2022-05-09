import { atom } from "recoil";

export type digitalSupport = {
	id?: number;
	event_name: string;
	participants: number;
	event_date: string;
	shop_name: string;
	half_count: boolean;
};

const initialData: digitalSupport[] = [];

export const digitalSupportState = atom({
	key: "digitalSupportState",
	default: initialData
});
