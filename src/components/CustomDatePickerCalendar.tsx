import { memo, useState, VFC } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ja from "date-fns/locale/ja";
import format from "date-fns/format";
import getMonth from "date-fns/getMonth";
import getYear from "date-fns/getYear";
import _ from "lodash";
import { useSetRecoilState } from "recoil";
import { dateState } from "../globalState/dateState";

registerLocale("ja", ja);

export const CustomDatePickerCalendar: VFC = memo(() => {
	const initialDate = new Date();
	const setDefaultDate = useSetRecoilState(dateState);

	const [startDate, setStartDate] = useState<Date>(initialDate);

	const getInputDate = (event: Date) => {
		setStartDate(event);
		const date = format(event, "yyyy/MM/dd");
		setDefaultDate(date);
	};
	const years = _.range(2021, getYear(new Date()) + 1, 1);
	const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
	return (
		<DatePicker
			renderCustomHeader={({
				date,
				changeYear,
				changeMonth,
				decreaseMonth,
				increaseMonth,
				prevMonthButtonDisabled,
				nextMonthButtonDisabled
			}) => (
				<div
					style={{
						margin: 10,
						display: "flex",
						justifyContent: "center"
					}}
				>
					<button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
						前の月へ
					</button>
					<select value={getYear(date)} onChange={({ target: { value } }) => changeYear(parseInt(value))}>
						{years.map((item) => {
							return (
								<option key={item} value={item}>
									{item}年
								</option>
							);
						})}
					</select>
					<select
						value={months[getMonth(date)]}
						onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
					>
						{months.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
					<button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
						次の月へ
					</button>
				</div>
			)}
			dateFormat="yyyy/MM/dd"
			locale="ja"
			selected={startDate}
			onChange={getInputDate}
		/>
	);
});
