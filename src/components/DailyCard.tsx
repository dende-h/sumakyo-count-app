import { Divider, Stack, Text, WrapItem } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { userCount } from "../pages";

type Props = {
	achievement: userCount;
};

export const DailyCard: VFC<Props> = memo((props: Props) => {
	const { achievement } = props;

	return (
		<>
			{achievement ? (
				<>
					<WrapItem>
						<Stack p={4} w={"250px"} backgroundColor={"twitter.100"} textAlign="center" borderRadius={"md"}>
							<Text fontSize={"lg"} fontWeight="bold">
								当日講座開催数
							</Text>
							<Divider borderColor={"blue.500"} />
							<Text fontSize={"x-large"} fontWeight={"bold"}>
								{achievement.seminar_count}回
							</Text>
						</Stack>
					</WrapItem>
					<WrapItem>
						<Stack p={4} w={"250px"} backgroundColor={"twitter.100"} textAlign="center" borderRadius={"md"}>
							<Text fontSize={"lg"} fontWeight="bold">
								当日リピートユーザー数
							</Text>
							<Divider borderColor={"blue.500"} />
							<Text fontSize={"x-large"} fontWeight={"bold"}>
								{achievement.u_usercount}人
							</Text>
						</Stack>
					</WrapItem>
					<WrapItem>
						<Stack p={4} w={"250px"} backgroundColor={"twitter.100"} textAlign="center" borderRadius={"md"}>
							<Text fontSize={"lg"} fontWeight="bold">
								当日新規ユーザー数
							</Text>
							<Divider borderColor={"blue.500"} />
							<Text fontSize={"x-large"} fontWeight={"bold"}>
								{achievement.new_usercount}人
							</Text>
						</Stack>
					</WrapItem>
					<WrapItem>
						<Stack p={4} w={"250px"} backgroundColor={"twitter.100"} textAlign="center" borderRadius={"md"}>
							<Text fontSize={"lg"} fontWeight="bold">
								当日MX講座開催数
							</Text>
							<Divider borderColor={"blue.500"} />
							<Text fontSize={"x-large"} fontWeight={"bold"}>
								{achievement.mx_seminar_count}回
							</Text>
						</Stack>
					</WrapItem>
					<WrapItem>
						<Stack p={4} w={"250px"} backgroundColor={"twitter.100"} textAlign="center" borderRadius={"md"}>
							<Text fontSize={"lg"} fontWeight="bold">
								当日MX講座ユーザー数
							</Text>
							<Divider borderColor={"blue.500"} />
							<Text fontSize={"x-large"} fontWeight={"bold"}>
								{achievement.mx_usercount}人
							</Text>
						</Stack>
					</WrapItem>
				</>
			) : undefined}
		</>
	);
});
