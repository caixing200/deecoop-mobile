import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text,Image,Canvas  } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtToast, AtInput,AtButton} from "taro-ui";

import { add, minus, asyncAdd } from '../../actions/counter'


import './index.scss'


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
class Index extends Component {

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
      isOpened: false,
      name: '',
      code: '',
      mobile: '',
      securityCode: '',
      email: '',
      tempSecurityCode: '',
      securityCodeKey: '',

      ruledCode: '',

      //输入状态
      nameState: false,
      codeState: false,
      mobileState: false,
      securityCodeState: false,
      emailState: false,

      httpOpend: false,
      msg: '',
      imgStr: '',

      saveOpend: false,
      saveStatus: 'loading',
      saveDuration: 0,
      saveText: '',

    }
    this.reg = {
      code: `^[A-Za-z0-9]$`,
      number: `\\d$`,
      mobile: `^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$`,
      email: `[\\w!#$%&'*+/=?^_\`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_\`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?`,
      url: `[a-zA-z]+:\\/\\/[^\\s]*`,
      zh: `^[\\u4e00-\\u9fa5]+$`,
      en: `^[A-Za-z]+$`,
      text: `^[A-Za-z\\u4e00-\\u9fa5]+&`,
      identity: `^(\\d{6})(\\d{4})(\\d{2})(\\d{2})(\\d{3})([0-9]|X|x)$`,
      float: `^(-?\\d+)(\\.\\d+)?$`,
      int: `^-?\\d+$`,
    }
    this.base_url = 'https://web.ouhaicloud.com/'
    this.isReset = true
  }

  componentWillReceiveProps (nextProps) {

  }

  componentDidMount() {

  }

  componentWillUnmount () { }

  componentDidShow () {
      this.isReset = true
    this.changeSecurityCode()
  }

  componentDidHide () {

  }

  btnClick (num) {
      if(num === 1){
        this.setState({
          companyUserCount: num,
          year: num,
          isOpened: false
        })
      }else {
        this.setState({
          companyUserCount: num,
          isOpened: false,
        })
      }
  }
  selectYear(num){
      if(this.state.companyUserCount !== 1){
        this.setState({
          year: num,
          isOpened: false,
        })
      }else {
        this.setState({
          isOpened: true
        })
      }
  }

  changeSecurityCode(){
    const that = this
    that.setState({
      imgStr: ''
    })
    Taro.request({
      url: `/api/system/userLogin/createSecurityCode`,
      method:'POST',
      mode:'cors',
      data: JSON.stringify({
        second: 6000
      }),
      success:function (data) {
        const res = data.data
        if(res.code == 0){
          that.setState({
            securityCode: '',
            tempSecurityCode : res.result.securityCode.toLowerCase(),
            securityCodeKey: res.result.securityCodeKey,
          })
          setTimeout(function () {
            that.drawPic(res.result.securityCode)
          },200)
        }
      },
      fail:function (err) {
        that.setState({
          httpOpend: true
        })
        setTimeout(function () {
          that.drawPic('1122')
        },200)
      }
    })
  }

  drawPic(txt ) {
    const that = this
    let canvas,width,height,ctx,tempImgStr
    if (process.env.TARO_ENV === 'weapp') {

      ctx = Taro.createCanvasContext('canvas',that.$scope)
      console.log(ctx)
      const dpr = Taro.getSystemInfoSync().pixelRatio
      width = 80 * dpr
      height = 30 * dpr
      ctx.scale(dpr, dpr)
      ctx.setTextBaseline('bottom')
      /**绘制背景色**/
      // ctx.setFillStyle(randomColor(180, 240));
      ctx.setFillStyle('red');
      ctx.fillRect(0, 0, width, height);
      /**绘制文字**/
      // const str = txt;
      // for(let i = 0; i < 4; i++) {
      //   const txt = str[i];
      //   ctx.setFillStyle(randomColor(50, 160));
      //   ctx.setFontSize(randomNum(18, 30) + 'px');
      //   let x = 5 + i * 20; //2 25 45 65
      //   let y = randomNum(25, 30);
      //   let deg = randomNum(-30, 30);
      //   //修改坐标原点和旋转角度
      //   ctx.translate(x, y);
      //   ctx.rotate(deg * Math.PI / 180);
      //   ctx.fillText(txt, 0, 0);
      //   //恢复坐标原点和旋转角度
      //   ctx.rotate(-deg * Math.PI / 180);
      //   ctx.translate(-x, -y);
      // }
      ctx.draw()
    } else if (process.env.TARO_ENV === 'h5') {
      const canvasBox = document.getElementById("canvas")
      canvas = canvasBox.getElementsByTagName('canvas')[0]
      if(this.isReset){
        canvas.width = canvasBox.offsetWidth
        canvas.height = canvasBox.offsetHeight
        this.isReset = false
      }

      width = canvas.width
      height = canvas.height
      ctx = canvas.getContext('2d')
      ctx.textBaseline = 'bottom'
      /**绘制背景色**/
      ctx.fillStyle = randomColor(180, 240); //颜色若太深可能导致看不清
      ctx.fillRect(0, 0, width, height);
      /**绘制文字**/
      const str = txt;
      for(let i = 0; i < 4; i++) {
        const txt = str[i];
        ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
        ctx.font = randomNum(18, 30) + 'px SimHei'; //随机生成字体大小
        let x = 5 + i * 20; //2 25 45 65
        let y = randomNum(25, 30);
        let deg = randomNum(-30, 30);
        //修改坐标原点和旋转角度
        ctx.translate(x, y);
        ctx.rotate(deg * Math.PI / 180);
        ctx.fillText(txt, 0, 0);
        //恢复坐标原点和旋转角度
        ctx.rotate(-deg * Math.PI / 180);
        ctx.translate(-x, -y);
      }
      tempImgStr = canvas.toDataURL( 'image/png', 1 )
      if(tempImgStr.length>7){
        that.setState({
          imgStr: tempImgStr
        })
      }else {
        that.setState({
          imgStr: ''
        },_=>{
          that.drawPic(txt)
        })
      }

      /**绘制干扰线**/
      // for(let i = 0; i < 8; i++) {
      // 	ctx.strokeStyle = randomColor(40, 180);
      // 	ctx.beginPath();
      // 	ctx.moveTo(randomNum(0, width), randomNum(0, height));
      // 	ctx.lineTo(randomNum(0, width), randomNum(0, height));
      // 	ctx.stroke();
      // }
      /**绘制干扰点**/
      //				for(let i = 0; i < 100; i++) {
      //					ctx.fillStyle = randomColor(0, 255);
      //					ctx.beginPath();
      //					ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI);
      //					ctx.fill();
      //				}

    }


    /**生成一个随机数**/
    function randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    }

    /**生成一个随机色**/
    function randomColor(min, max) {
      var r = randomNum(min, max)
      var g = randomNum(min, max)
      var b = randomNum(min, max)
      return "rgb(" + r + "," + g + "," + b + ")"
    }


  }

  nameChange(val){
    this.setState(
      {
        name: val
      }
    )
  }
  nameRule(){
    this.setState({
      nameState: this.state.name?false:true,
    })
  }
  codeChange(val){
    this.setState(
      {
        code: val,
        codeState: false,
      }
    )
  }
  codeRule(){
    const that = this
    if(this.state.code && this.state.code != this.state.ruledCode){
      // $.post(
      //   `${this.base_url}system/checkExistCompanyCode`,
      //   {
      //     code:this.state.code
      //   },
      //   function (res) {
      //     if(res.code === 0){
      //       that.setState({
      //         dialogTxt: '此账号无重复，可以使用',
      //         ruledCode: that.state.code,
      //         codeState: true
      //       })
      //       // $('#myModal').modal('toggle')
      //     }else {
      //       that.setState({
      //         codeState: false,
      //         ruledCode: that.state.code,
      //       })
      //     }
      //   }
      // )
      Taro.request({
        url: '/api/system/checkExistCompanyCode',
        method:'POST',
        mode:'cors',
        data: JSON.stringify({
          code:this.state.code
        }),
        success:function (data) {
          const res = data.data
            if(res.code === 0){
              that.setState({
                ruledCode: that.state.code,
                codeState: false
              })
            }else {
              that.setState({
                codeState: true,
                ruledCode: that.state.code,
                msg: res.msg,
                httpOpend: true,
              })
            }
        }
      })
    }else if(!this.state.code){
      that.setState({
        codeState: false,
      })
    }

  }

  mobileChange(val){
    this.setState({
      mobile: val,
      mobileState: val?!new RegExp(this.reg.mobile).test(val):true
    })
  }
  mobileRule(){
    if(this.state.mobile){
      const text = new RegExp(this.reg.mobile)
      this.setState({
        mobileState: !text.test(this.state.mobile),
      })
    }else {
      this.setState({
        mobileState: true,
      })
    }
  }

  securityCodeChange(val){
    this.setState(
      {
        securityCode: val,
        securityCodeState: val != this.state.tempSecurityCode
      }
    )
  }
  securityCodeRule(){
    if(this.state.securityCode){
      this.setState({
        securityCodeState: this.state.securityCode != this.state.tempSecurityCode,
      })
    }else {
      this.setState({
        securityCodeState: true,
      })
    }
  }

  emailChange(val){
    this.setState({
      email: val,
      emailState: val?!new RegExp(this.reg.email).test(val):true
    })
  }
  emailRule(){
    if(this.state.email){
      const text = new RegExp(this.reg.email)
      this.setState({
        emailState: !text.test(this.state.email),
      })
    }else {
      this.setState({
        emailState: true,
      })
    }
  }

  toastClose(){
    this.setState({
      httpOpend: false,
      saveOpend: false,
      isOpened: false,
    })
  }

  handleSubmit(){
    const that = this
    if(this.state.name){
      this.setState({
        nameState: false,
      })
    }else {
      this.setState({
        nameState: true,
      })
      return;
    }
    if(this.state.code){
      const text = new RegExp(this.reg.en)
      if(!text.test(this.state.code)){
        this.setState({
          codeState: true,
        })
        return
      }else {
        this.setState({
          codeState: false,
        })
      }
    }else {
      this.setState({
        codeState: true,
      })
      return;
    }
    if(this.state.mobile){
      const text = new RegExp(this.reg.mobile)
      if(!text.test(this.state.mobile)){
        this.setState({
          mobileState: true,
        })
        return
      }else {
        this.setState({
          mobileState: false,
        })
      }
    }else {
      this.setState({
        mobileState: true,
      })
      return;
    }
    if(this.state.securityCode){
      if(this.state.securityCode != this.state.tempSecurityCode){
        this.setState({
          securityCodeState: true,
        })
        return
      }else {
        this.setState({
          securityCodeState: false,
        })
      }
    }else {
      this.setState({
        securityCodeState: true,
      })
      return;
    }
    if(this.state.email){
      const text = new RegExp(this.reg.email)
      if(!text.test(this.state.email)){
        this.setState({
          emailState: true,
        })
        return
      }else {
        this.setState({
          emailState: false,
        })
      }
    }else {
      this.setState({
        emailState: true,
      })
      return;
    }
    this.setState({
      saveOpend: true,
      saveStatus: 'loading',
      saveDuration: 0,
      saveText: '保存中...',
    })
    Taro.request({
      url:'/api/system/companyApplication',
      method:'POST',
      mode:'cors',
      data: JSON.stringify({
        name: this.state.name,
        code: this.state.code,
        mobile: this.state.mobile,
        securityCode: this.state.securityCode,
        securityCodeKey: this.state.securityCodeKey,
        email: this.state.email,
        roleKey: 'a,b,c,d',
        companyUserCount: this.state.companyUserCount,
        year: this.state.year,
      }),
      success:function (data) {
        const res = data.data
        if(res.code === 0){
          that.setState({
            saveStatus: 'success',
            saveDuration: 1500,
            saveText: '保存成功！',
          })
          setTimeout(function () {
            Taro.navigateTo({
              url: `/pages/register/index?notCost=${res.result.notCost?'1':'0'}&userCode=${res.result.userCode}&year=${that.state.year}&companyUserCount=${that.state.companyUserCount}`
            }).then(_=>{
              that.resetState()
            })
          },1500)
        }else {
          that.changeSecurityCode()
          that.setState({
            saveStatus: 'error',
            saveDuration: 1500,
            saveText: '保存失败，请重试',
          })
        }
      },
      fail:function (err) {
        that.setState({
          saveStatus: 'error',
          saveDuration: 1500,
          saveText: '保存失败',
        })
      }
    })
  }

  resetState(){
      this.setState({
        companyUserCount: 1,
        year: 1,
        isOpened: false,
        name: '',
        code: '',
        mobile: '',
        securityCode: '',
        email: '',
        tempSecurityCode: '',
        securityCodeKey: '',

        ruledCode: '',

        //输入状态
        nameState: false,
        codeState: false,
        mobileState: false,
        securityCodeState: false,
        emailState: false,

        httpOpend: false,
        msg: '',
        imgStr: '',

        saveOpend: false,
        saveStatus: 'loading',
        saveDuration: 0,
        saveText: '',

      })
  }

  scrollView(v,e){
    if(process.env.TARO_ENV === 'h5'){
      e.target.scrollIntoViewIfNeeded(true)
    }
  }

  render () {
    return (
      <View className='index'>
        <View className='customtag'>
          <Text className='customtag-leftarrow'></Text>
          <Text className='customtag-text'>套餐选择</Text>
          <Text className='customtag-rightarrow'></Text>
        </View>
        <View className='btnView'>
          <View className='btnTitle'>模块：</View>
          <View className='btnBoxs'>
            <View className='btnBox'>
              <View className='btns'>
                <View className='btn is-active'>销售</View>
              </View>
              <View className='btns'>
                <View className='btn is-active'>采购</View>
              </View>
              <View className='btns'>
                <View className='btn is-active'>仓库</View>
              </View>
              <View className='btns-long'>
                <View className='btn is-active'>生产计划</View>
              </View>
            </View>
          </View>
        </View>
        <View className='btnView'>
          <View className='btnTitle1'>用户数：</View>
          <View className='btnBoxs'>
            <View className='btnBox'>
              <View className='btns'>
                <View className={`btn ${this.state.companyUserCount === 1?'is-active':''}`} hoverClass='btnHover' hoverStartTime='0' onClick={_=>this.btnClick(1)}>1</View>
              </View>
              <View className='btns'>
                <View className={`btn ${this.state.companyUserCount === 5?'is-active':''}`} hoverClass='btnHover' hoverStartTime='0' onClick={_=>this.btnClick(5)}>5</View>
              </View>
              <View className='btns'>
                <View className={`btn ${this.state.companyUserCount === 10?'is-active':''}`} hoverClass='btnHover' hoverStartTime='0' onClick={_=>this.btnClick(10)}>10</View>
              </View>
              <View className='btns'>
                <View className={`btn ${this.state.companyUserCount === 50?'is-active':''}`} hoverClass='btnHover' hoverStartTime='0' onClick={_=>this.btnClick(50)}>50</View>
              </View>
              <View className='btns-long'>
                <View className={`btn ${this.state.companyUserCount > 50?'is-active':''}`} hoverClass='btnHover' hoverStartTime='0' onClick={_=>this.btnClick(9999)}>&gt;50</View>
              </View>
            </View>
          </View>
        </View>
        <View className='btnView'>
          <View className='btnTitle1'>时间：</View>
          <View className='btnBoxs'>
            <View className='btnBox'>
              <View className='btns'>
                <View className={`btn ${this.state.year === 1?'is-active':''}`} hoverClass='btnHover' hoverStartTime='0' onClick={_=>this.selectYear(1)}>1年</View>
              </View>
              <View className='btns'>
                <View className={`btn ${this.state.year === 2?'is-active':''}`} hoverClass='btnHover' hoverStartTime='0' onClick={_=>this.selectYear(2)}>2年</View>
              </View>
              <View className='btns'>
                <View className={`btn ${this.state.year === 3?'is-active':''}`} hoverClass='btnHover' hoverStartTime='0' onClick={_=>this.selectYear(3)}>3年</View>
              </View>
              <View className='btns'>
                <View className={`btn ${this.state.year > 3?'is-active':''}`} hoverClass='btnHover' hoverStartTime='0' onClick={_=>this.selectYear(9999)}>无限</View>
              </View>
            </View>
          </View>
        </View>
        <View className='tempRegister'>
          <View className='registerView'>
            <Text className='registerTitle'>费用：</Text><Text className='registerCost'>{this.state.costObj[this.state.companyUserCount][this.state.year]}</Text>
          </View>
        </View>
        <View className='customtag'>
          <Text className='customtag-leftarrow'></Text>
          <Text className='customtag-text'>用户信息</Text>
          <Text className='customtag-rightarrow'></Text>
        </View>
        <View className='inputView'>
          <View className='inputBox'>
            <AtInput
              title='企业名称'
              type='text'
              error={this.state.nameState}
              placeholder='请输入您的企业名称'
              value={this.state.name}
              onFocus={this.scrollView.bind(this)}
              onChange={this.nameChange.bind(this)}
              onBlur={this.nameRule.bind(this)}/>
              <View className='inputTag'>*</View>
          </View>
          <View className='inputBox'>
            <AtInput
              title='企业简称'
              error={this.state.codeState}
              type='text'
              placeholder='请输入英文作为登录账号'
              value={this.state.code}
              onFocus={this.scrollView.bind(this)}
              onChange={this.codeChange.bind(this)}
              onBlur={this.codeRule.bind(this)}/>
            <View className='inputTag'>*</View>
          </View>
          <View className='inputBox'>
            <AtInput
              title='手机号'
              type='phone'
              error={this.state.mobileState}
              placeholder='后6位为登录密码'
              value={this.state.mobile}
              onFocus={this.scrollView.bind(this)}
              onChange={this.mobileChange.bind(this)}
              onBlur={this.mobileRule.bind(this)}/>
            <View className='inputTag'>*</View>
          </View>
          <View className='inputBox'>
            <AtInput
              title='验证码'
              type='text'
              error={this.state.securityCodeState}
              maxLength='4'
              placeholder='请输入验证码'
              value={this.state.securityCode}
              onFocus={this.scrollView.bind(this)}
              onChange={this.securityCodeChange.bind(this)}
              onBlur={this.securityCodeRule.bind(this)}>
              {
                process.env.TARO_ENV === 'weapp'
                  ?<Canvas style='width: 80px; height: 30px;' type='2d' canvasId='canvas' id='canvas'/>
                  :(this.state.imgStr
                    ?<Image src={this.state.imgStr} style='height:30px' onClick={this.changeSecurityCode.bind(this)}></Image>
                    :<Canvas style='width: 80px; height: 30px;' type='2d' canvasId='canvas' id='canvas'/>)

              }
            </AtInput>
            <View className='inputTag'>*</View>
          </View>
          <View className='inputBox'>
            <AtInput
              title='联系邮箱'
              type='text'
              error={this.state.emailState}
              placeholder='便于您接收账号信息'
              value={this.state.email}
              onFocus={this.scrollView.bind(this)}
              onChange={this.emailChange.bind(this)}
              onBlur={this.emailRule.bind(this)}/>
            <View className='inputTag'>*</View>
          </View>
        </View>
        <View className='loginMassgae'>
          <Text>注册后，账户名和初始密码会发送到您的邮箱，请注意查收。</Text>
        </View>
        <View className='loginBtn'>
          <AtButton
            full
            type='primary'
            onClick={this.handleSubmit.bind(this)}>申<Text className='loginEmpty'></Text>请</AtButton>
        </View>
        <AtToast isOpened={this.state.isOpened} duration={1500} text='用户数为1时不可选' hasMask onClose={this.toastClose.bind(this)}></AtToast>
        <AtToast isOpened={this.state.httpOpend} duration={2000} text={this.state.msg || '网络错误'} hasMask onClose={this.toastClose.bind(this)}></AtToast>
        <AtToast isOpened={this.state.saveOpend} status={this.state.saveStatus} text={this.state.saveText} duration={this.state.saveDuration} hasMask onClose={this.toastClose.bind(this)}></AtToast>
      </View>
    )
  }
}

export default Index
