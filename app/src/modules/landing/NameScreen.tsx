import { Text, TextInput, View } from "react-native"
import { useState } from "react"
import useLandingStore from "./shared/useLandingStore"
import LandingScreenContainer, { type LandingScreen } from "./shared/LandingScreen"
import useHideSplashScreen from "../shared/hooks/useHideSplashScreen"
import ContinueButton from "./shared/ContinueButton"
import colors from "../../../colors"

const NameScreen: LandingScreen = ({ goToNextScreen }) => {
	useHideSplashScreen()

	const [nameInput, setNameInput] = useState("")

	const inputIsValid = nameInput.length >= 2 && nameInput.length <= 50

	const onContinue = () => {
		useLandingStore.setState({ name: nameInput })
		goToNextScreen()
	}

	return (
		<LandingScreenContainer first backgroundColor="purple">
			<Text className="mt-6 text-center text-lg font-bold text-white-text">
				First of all, what's your name?
			</Text>

			<TextInput
				value={nameInput}
				onChangeText={setNameInput}
				autoFocus
				autoCorrect={false}
				placeholder="Your name"
				placeholderTextColor="#FFFFFF80"
				selectionColor={colors["white-selection-color"]}
				textContentType="name"
				autoComplete="name"
				className="mt-2.5 h-10 text-center text-4xl font-bold text-white-text"
			/>

			<View className="flex-1" />

			<ContinueButton
				text="Continue"
				onPress={onContinue}
				disabled={!inputIsValid}
				buttonColor="white"
				raisedByKeyboard
			/>
		</LandingScreenContainer>
	)
}

export default NameScreen
