import React, { Component, PureComponent } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Platform
} from 'react-native'
import Reactigation, { register, go, back, currentScreen } from 'reactigation'
import AnimatedLink from './AnimatedLink'

// Shadow styles with iOS Compatibility (elevation).
const shadow = () => ({
  shadowOpacity: 0.25,
  shadowRadius: 3,
  shadowOffset: {
    height: 0
  },
  elevation: 5
})

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  header: {
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    ...shadow()
  },
  body: {
    flex: 1,
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 20
  },
  backTouchable: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'black'
  },
  back: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  headerPlaceholder: {
    flex: 1
  },
  description: {
    fontSize: 25
  },
  tabs: {
    backgroundColor: 'white',
    ...shadow(),
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingRight: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
})

class Screen extends Component {
  constructor(props) {
    super(props)
  }

  renderTabs() {
    const tabs = ['First', 'Second', 'Third']
    const current = currentScreen()

    return tabs.map(name => (
      <TouchableOpacity key={name} onPress={() => go(name, 'none')}>
        <Text style={[
          styles.description, current === name ? { fontWeight: 'bold' } : undefined
        ]}>{name}</Text>
      </TouchableOpacity>
    ))
  }

  renderLinks() {
    const { links, showAnimations } = this.props

    return links.map(name => (
      <AnimatedLink
        key={name}
        name={name}
        textStyle={styles.description}
        showAnimations={showAnimations}
      />
    ))
  }

  renderBack() {
    const { backPossible } = this.props

    if (!backPossible) {
      return <View style={styles.headerPlaceholder} />
    }

    return (
      <TouchableHighlight underlayColor="white" style={styles.backTouchable} onPress={() => back()}>
        <Text style={styles.back}>Back</Text>
      </TouchableHighlight>
    )
  }

  render() {
    const { title } = this.props

    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          {this.renderBack()}
          <Text style={styles.title}>{title}</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.body}>
          {this.renderLinks()}
          <TouchableHighlight onPress={() => go('Modal')}>
            <Text style={styles.description}>Open Modal</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.tabs}>
          {this.renderTabs()}
        </View>
      </View>
    )
  }
}

const stylesModal = StyleSheet.create({
  modal: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 20
  },
  closeTouchable: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    backgroundColor: 'black',
    padding: 5,
    borderRadius: 5,
    zIndex: 2
  },
  close: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
  }
})

class Modal extends Component {
  render() {
    const { title } = this.props

    return (
      <View style={stylesModal.modal}>
        <TouchableHighlight underlayColor="white" style={stylesModal.closeTouchable} onPress={() => back()}>
          <Text style={stylesModal.close}>Close</Text>
        </TouchableHighlight>
        <Text style={styles.title}>{title}</Text>
        <TouchableHighlight onPress={() => go('AnotherModal')}>
          <Text style={styles.description}>Open Another Modal</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

// All possible screen components.
const Screens = {
  First: <Screen key="First" title={'FirstScreen'} showAnimations links={['Second']} />,
  Second: <Screen key="Second" title={'SecondScreen'} links={['First', 'Third']} />,
  Third: <Screen key="Third" title={'ThirdScreen'} showAnimations links={['Second']} />,
  Modal: <Modal key="Modal" title={'Modal'} />,
  AnotherModal: <Modal key="AnotherModal" title={'Another Modal'} />
}

// Register screens.
Object.keys(Screens).map(ScreenName =>
  register(
    Screens[ScreenName],
    ScreenName,
    ScreenName.includes('Modal') ? 'modal' : undefined
  )
)

export default Reactigation
