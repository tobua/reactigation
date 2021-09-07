import React from 'react'
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native'
import Reactigation, { register, go, back } from 'reactigation'
import { name as appName } from './app.json'
import { AnimatedLink } from './component/AnimatedLink'
import { Static } from './component/Static'

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
  screen: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...shadow(),
  },
  body: {
    flex: 1,
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 20,
  },
  backTouchable: {
    position: 'absolute',
    flex: 1,
    left: 20,
    top: Platform.OS === 'ios' ? 46 : 16,
    backgroundColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingRight: 20,
    paddingBottom: 8,
    paddingLeft: 20,
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'black',
  },
  back: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },
  description: {
    fontSize: 25,
    color: 'black',
  },
})

const Screen = ({ name, title, links, showAnimations, backPossible }) => (
  <View style={styles.screen}>
    <View style={styles.header}>
      {!backPossible ? (
        <View style={styles.headerPlaceholder} />
      ) : (
        <TouchableOpacity
          underlayColor="white"
          style={styles.backTouchable}
          onPress={() => back()}
        >
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
    <View style={styles.body}>
      {links.map((linkName) => (
        <AnimatedLink
          key={linkName}
          name={linkName}
          textStyle={styles.description}
          showAnimations={showAnimations}
        />
      ))}
      <TouchableOpacity onPress={() => go('Modal')}>
        <Text style={styles.description}>Open Modal</Text>
      </TouchableOpacity>
    </View>
  </View>
)

const stylesModal = StyleSheet.create({
  modal: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 20,
  },
  closeTouchable: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    backgroundColor: 'black',
    padding: 5,
    borderRadius: 5,
    zIndex: 2,
  },
  close: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
})

const Modal = ({ title }) => (
  <View style={stylesModal.modal}>
    <StatusBar backgroundColor="white" barStyle="dark-content" />
    <TouchableOpacity
      underlayColor="white"
      style={stylesModal.closeTouchable}
      onPress={() => back()}
    >
      <Text style={stylesModal.close}>Close</Text>
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
    <TouchableOpacity onPress={() => go('AnotherModal')}>
      <Text style={styles.description}>Open Another Modal</Text>
    </TouchableOpacity>
  </View>
)

// All possible screen components.
const Screens = {
  First: (
    <Screen
      key="First"
      title={'FirstScreen'}
      showAnimations
      links={['Second']}
    />
  ),
  Second: (
    <Screen key="Second" title={'SecondScreen'} links={['First', 'Third']} />
  ),
  Third: (
    <Screen
      key="Third"
      title={'ThirdScreen'}
      showAnimations
      links={['Second']}
    />
  ),
  Modal: <Modal key="Modal" title="Modal" />,
  AnotherModal: <Modal key="AnotherModal" title="Another Modal" />,
}

// Register screens.
Object.keys(Screens).map((ScreenName) =>
  register(Screens[ScreenName], ScreenName, {
    transition: ScreenName.includes('Modal') ? 'modal' : undefined,
    background: ScreenName === 'Second' ? 'lightgray' : 'white',
  })
)

const App = () => (
  <>
    <Reactigation />
    <Static />
  </>
)

AppRegistry.registerComponent(appName, () => App)
