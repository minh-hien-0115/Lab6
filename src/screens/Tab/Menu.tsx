import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Menu = ({navigation}: any) => {
  return (
    <View>
      <Button title="Menu" onPress={() => navigation.navigate('DrawerNavigation')} />
    </View>
  )
}

export default Menu

const styles = StyleSheet.create({})