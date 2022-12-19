import PagerView from "react-native-pager-view"
import { styled } from "nativewind"
import { StatusBar } from "expo-status-bar"
import { Pressable, View, Modal } from "react-native"
import { useState } from "react"
import { AntDesign } from "@expo/vector-icons"
import type { MainLayoutScreen } from "../layout/MainLayoutScreens"
import MainText from "../../components/MainText"
import { trpc } from "../../lib/trpc"
import ChatInput from "./ChatInput"
import FadeAnimation from "../../components/FadeAnimation"

const StyledPagerView = styled(PagerView)

const UserPickingPage: MainLayoutScreen = ({ active }) => {
	const [isPicking, setIsPicking] = useState(false)

	const { data: choices } = trpc.picking.choices.useQuery()

	const { mutate: chooseUser } = trpc.picking.choose.useMutation()

	const [selectedUsername, setSelectedUsername] = useState("")

	const [chatInputOpen, setChatInputOpen] = useState(false)

	const queryClient = trpc.useContext()

	const onSend = ({ textInput }: { textInput: string }) => {
		setIsPicking(false)
		chooseUser(
			{ chooseeUsername: selectedUsername, firstMessage: textInput },
			{
				onSuccess: () => queryClient.inbox.conversationsAsChooser.invalidate(),
			}
		)
	}

	const onChatClose = () => {
		setChatInputOpen(false)
	}

	return (
		<View className="flex-1">
			{isPicking && choices ? (
				<Modal animationType="slide" transparent>
					<View className="absolute top-5 left-5 z-10">
						<AntDesign
							name="close"
							size={30}
							color="white"
							onPress={() => setIsPicking(false)}
							suppressHighlighting
						/>
					</View>

					<StyledPagerView
						initialPage={0}
						onPageSelected={({ nativeEvent: { position } }) =>
							setSelectedUsername(choices[position].username)
						}
						className="flex-1 absolute top-0 bottom-0 left-0 right-0"
					>
						{choices.map((choice) => (
							<View
								key={choice.username}
								className={`flex-1 flex-row px-10 ${
									[
										"bg-primary-300",
										"bg-primary-400",
										"bg-primary-500",
										"bg-primary-600",
										"bg-secondary-500",
									][choice.username.charCodeAt(0) % 5]
								}`}
							>
								<View className="h-1/4 w-full justify-between items-center self-center flex-col">
									<MainText
										size="5xl"
										weight="medium"
										light
										className="leading-[56px] text-center"
									>
										{choice.name}
									</MainText>

									<FadeAnimation visible={!chatInputOpen} duration={250}>
										<Pressable
											onPress={() => setChatInputOpen(true)}
											className="bg-[#FFFFFF30] px-8 py-2.5 rounded-full"
										>
											<MainText size="2xl" weight="light" light>
												Choose
											</MainText>
										</Pressable>
									</FadeAnimation>
								</View>

								{active && <StatusBar style="light" hidden={isPicking} />}
							</View>
						))}
					</StyledPagerView>

					<ChatInput
						open={chatInputOpen}
						onClose={onChatClose}
						onSubmit={onSend}
						placeholder="Send a message anonymously"
					/>
				</Modal>
			) : null}

			<View className="bg-[#121213] flex-1 justify-center items-center ">
				<Pressable
					className="px-8 py-3 bg-secondary-500 rounded-full"
					onPress={() => setIsPicking(true)}
				>
					<MainText size="xl" weight="light" light>
						Start Picking
					</MainText>
				</Pressable>

				<View className="absolute bottom-0 left-0 right-0 h-6 bg-primary-600" />
			</View>
		</View>
	)
}

export default UserPickingPage