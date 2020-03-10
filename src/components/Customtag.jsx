import Taro, { Component } from '@tarojs/taro'
import { View,  Text } from '@tarojs/components'


export default class Customtag extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <View className='customtag'>
        <Text className='customtag-leftarrow'></Text>
        <Text className='customtag-text'>{this.props.text}</Text>
        <Text className='customtag-rightarrow'></Text>
      </View>
    )
  }
}
