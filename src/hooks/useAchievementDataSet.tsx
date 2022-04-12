import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { achievementsArray } from "../globalState/achievementsArray";
import { achievementTotalArray } from "../globalState/selector/achievementTotalArray";
import { showAchievementsTableArray } from "../globalState/selector/showAchievementsTabeleArray";

export const useAchievementDataSet = ({ achievements }) => {
	//実績データの取得とglobalStateへの登録
	const setAchievements = useSetRecoilState(achievementsArray);
	useEffect(() => {
		setAchievements(achievements);
	}, []);
	//実績データのトータルを計算するselector
	const totalAchievements = useRecoilValue(achievementTotalArray);

	//表示する実績のselector、年月と店舗の選択によってfilterされる
	const showAchievements = useRecoilValue(showAchievementsTableArray);

	return { totalAchievements, showAchievements };
};
