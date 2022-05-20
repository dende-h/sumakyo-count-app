import { Divider, Stack, Text, Wrap, WrapItem, HStack, VStack } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { digitalSupport } from "../../globalState/digitalSupport/digitalSupportState";
import { DeleteDigitalSupportModal } from "./DeleteDigitalSupportModal";
import { EditShowDigitalSupportModal } from "./EditShowDigitalSupportModal";

type Props = { showDigitalSupportArray: digitalSupport[] };

export const ShowDigitalSupportCard: VFC<Props> = memo((props: Props) => {
	const { showDigitalSupportArray } = props;

	return (
		<>
			<Wrap marginLeft={[14, 8, 6]}>
				{showDigitalSupportArray.map((item) => {
					return (
						<WrapItem key={item.id} p={2}>
							<VStack>
								<Stack bgColor={"white"} p={3} spacing={2} borderRadius={"full"} w={"130px"}>
									<Text fontSize={"sm"} textAlign={"center"}>
										{item.event_date}
									</Text>
									<Divider />
									<Text fontSize={"sm"}>{item.event_name}</Text>
									<Text textAlign={"center"} fontSize={"sm"}>
										{item.participants}人参加
									</Text>
								</Stack>
								<HStack>
									<EditShowDigitalSupportModal editItem={item} />
									<DeleteDigitalSupportModal id={item.id} />
								</HStack>
							</VStack>
						</WrapItem>
					);
				})}
			</Wrap>
		</>
	);
});
