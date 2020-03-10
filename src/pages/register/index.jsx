import Taro, { Component } from '@tarojs/taro'
import { View, Text, Icon,Button,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'

import './index.scss'
import {AtButton,AtModal,AtModalHeader,AtModalContent,AtModalAction} from "taro-ui";
import weappCode from './weapp_code.jpg'


@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  }
}))
class Register extends Component {

    config = {
    navigationBarTitleText: 'DEECOOP'
  }
  constructor(props) {
    super(props);
    this.state = {
      companyUserCount: 1,
      year: 1,
      costObj: {
        '1':{
          '1': '试用'
        },
        '5':{
          '1': '￥3999',
          '2': '￥7299',
          '3': '￥10299',
          '9999': '￥16999',
        },
        '10':{
          '1': '￥5999',
          '2': '￥10999',
          '3': '￥15999',
          '9999': '￥23999',
        },
        '50':{
          '1': '￥10999',
          '2': '￥19999',
          '3': '￥28999',
          '9999': '￥43999',
        },
        '9999':{
          '1': '￥29999',
          '2': '￥53999',
          '3': '￥76999',
          '9999': '￥119999',
        },
      },
      modalOpen: false,
      userCode: '',
    }
  }

  componentWillMount () {
      const params = this.$router.params
      this.setState({
        userCode:params.userCode,
        companyUserCount: params.companyUserCount,
        year: params.year,
      })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  goSaas(){
    this.setState({
      modalOpen: true
    })
  }
  closeModal(){
    this.setState({
      modalOpen: false
    })
  }

  render () {
    return (
      <View className='register'>
        <View className='registerSuccess'>
          <View className='icon'>
            <Icon size='80' type='success' />
          </View>
          <View className='iconTxt'>恭喜，申请成功！</View>
        </View>
        {
          this.state.companyUserCount == 1
            ?<View className='resultView'>
              <View className='customtag'>
                <Text className='customtag-leftarrow'></Text>
                <Text className='customtag-text'>账号信息</Text>
                <Text className='customtag-rightarrow'></Text>
              </View>
              <View className='info'>
                <View className='infoBox'>
                  <Text>试用账号：</Text><Text>{this.state.userCode}</Text>
                </View>
                <View className='infoBox'>
                  <Text>初始密码：</Text><Text>手机号后6位</Text>
                </View>
              </View>
              <View className='massage'>详细信息已发送至邮箱，请注意查收。</View>
            </View>
            :<View className='resultView'>
              <View className='customtag'>
                <Text className='customtag-leftarrow'></Text>
                <Text className='customtag-text'>订购信息</Text>
                <Text className='customtag-rightarrow'></Text>
              </View>
              <View className='buyInfo'>
                <View className='buyInfoBox'>
                  <Text className='buyInfoTitle'>订购套餐</Text><Text className='buyInfoD'>：</Text><Text className='buyInfoContent'>销售、采购、仓库、生产计划</Text>
                </View>
                <View className='buyInfoBox'>
                  <Text className='buyInfoTitle'>订购时间</Text><Text className='buyInfoD'>：</Text><Text className='buyInfoContent'>{this.state.year>3?'无限':this.state.year+'年'}</Text>
                </View>
                <View className='buyInfoBox'>
                  <Text className='buyInfoTitle'>套餐用户</Text><Text className='buyInfoD'>：</Text><Text className='buyInfoContent'>{this.state.companyUserCount>50?'无限':this.state.companyUserCount}</Text>
                </View>
                <View className='buyInfoBox'>
                  <Text className='buyInfoTitle'>账号</Text><Text className='buyInfoD'>：</Text><Text className='buyInfoContent'>{this.state.userCode}</Text>
                </View>
                <View className='buyInfoBox'>
                  <Text className='buyInfoTitle'>初始密码</Text><Text className='buyInfoD'>：</Text><Text className='buyInfoContent'>手机号后6位</Text>
                </View>
              </View>
              <View className='customtag'>
                <Text className='customtag-leftarrow'></Text>
                <Text className='customtag-text'>付款信息</Text>
                <Text className='customtag-rightarrow'></Text>
              </View>
              <View className='buyInfo'>
                <View className='buyInfoBox'>
                  <Text className='buyInfoTitle'>企业名称</Text><Text className='buyInfoD'>：</Text><Text className='buyInfoContent'>浙江顶智智能技术有限公司</Text>
                </View>
                <View className='buyInfoBox'>
                  <Text className='buyInfoTitle verticalAlignTop'>开户银行</Text><Text className='buyInfoD verticalAlignTop'>：</Text><Text className='buyInfoContent verticalAlignTop'>工商银行温州瓯海支行火车站分理处</Text>
                </View>
                <View className='buyInfoBox'>
                  <Text className='buyInfoTitle'>银行账户</Text><Text className='buyInfoD'>：</Text><Text className='buyInfoContent'>1203227809200060605</Text>
                </View>
                <View className='buyInfoBox'>
                  <Text className='buyInfoTitle'>付款金额</Text><Text className='buyInfoD'>：</Text><Text className='buyInfoContent'><Text className='registerCost'>{this.state.costObj[this.state.companyUserCount][this.state.year]}</Text></Text>
                </View>
              </View>
              <View className='customtag'>
                <Text className='customtag-leftarrow'></Text>
                <Text className='customtag-text'>温馨提示</Text>
                <Text className='customtag-rightarrow'></Text>
              </View>
              <View className='buyMsg'>
                <View className='buyMsgTxt'>您有10天体验时间</View>
                <View className='buyMsgTxt'>请尽快按照付款信息付费，以免账号停用！</View>
              </View>
              <View className='massage'>详细信息已发送至邮箱，请注意查收。</View>
            </View>
        }


        <View className='loginBtn'>
          <AtButton
            full
            type='primary'
            onClick={this.goSaas.bind(this)}>进入登录页</AtButton>
        </View>

        <AtModal
          isOpened={this.state.modalOpen}
          closeOnClickOverlay={false}>
          <AtModalHeader>长按下图进入系统登录</AtModalHeader>
          <AtModalContent>
            <Image src={weappCode} mode='aspectFit'  style='height:auto;width:100%;'></Image>
          </AtModalContent>
          <AtModalAction><Button onClick={this.closeModal.bind(this)}>关闭</Button> </AtModalAction>
        </AtModal>
      </View>
    )
  }
}

export default Register
