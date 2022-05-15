import { Box, Button, Divider, Select, Stack, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue } from "recoil";
import { CustomDatePickerCalendar } from "../components/CustomDatePickerCalendar";
import { DigitalSupportInputModal } from "../components/DigitalSupportInputModal";
import { InputItemsCard } from "../components/InputItemsCard";
import { dateState } from "../globalState/dateState";
import { digitalSupportEventArray } from "../globalState/digitalSupportEventArray";
import { digitalSupport, digitalSupportState } from "../globalState/digitalSupportState";
import { isLoadingState } from "../globalState/isLoadingState";
import { shopNameArray } from "../globalState/shopNameArray";
import { useCountUpDown } from "../hooks/useCountUpDown";
import { useSelectOnChange } from "../hooks/useSelectOnChange";
import { useYearMonthDataSet } from "../hooks/useYearMonthDataSet";

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const DigitalSupport = ({ digital_support }) => {
	return (
		<>
			<Box m={4}>
				<Stack>
					<Text fontSize={"x-large"} fontWeight="bold">
						デジタル活用支援実績
					</Text>
					<Divider borderColor={"gray.500"} />
					<DigitalSupportInputModal digital_support={digital_support} />
				</Stack>
			</Box>
		</>
	);
};

export const getServerSideProps = async () => {
	const { data: digital_support, error } = await supabase.from("digital_support").select("*");
	if (error) {
	}
	return { props: { digital_support } };
};

export default DigitalSupport;
