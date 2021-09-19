import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native'
import { go, useCurrentScreen } from 'reactigation'

// Shadow styles with iOS Compatibility (elevation).
const shadow = () => ({
  shadowOpacity: 0.25,
  shadowRadius: 3,
  shadowOffset: {
    height: 0,
  },
  elevation: 5,
})

const styles = StyleSheet.create({
  tabs: {
    backgroundColor: 'white',
    ...shadow(),
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingRight: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  description: {
    fontSize: 25,
    color: 'black',
  },
  bold: { fontWeight: 'bold' },
})

export const Static = () => {
  const currentScreen = useCurrentScreen()

  if (currentScreen.includes('Modal')) {
    return null
  }

  return (
    <View style={styles.tabs}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      {['First', 'Second', 'Third'].map((screenName) => (
        <TouchableOpacity
          key={screenName}
          onPress={() => go(screenName, 'none')}
        >
          <Text
            style={[
              styles.description,
              currentScreen === screenName ? styles.bold : undefined,
            ]}
          >
            {screenName}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}
