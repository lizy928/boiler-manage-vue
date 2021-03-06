import element from "../entity/element";
import deviceFieldForUI from '../meta/deviceFieldForUI'
import byteField from '../meta/byteField'
import commandField from '../meta/commandField'
import {coms_media,coms_power} from '../map/commonValueMap'
import command from '../entity/command'


export const deviceModel= {
    power_media_value_null : -1,
    key_point_system_status:'o_system_status',
    key_point_power:'o_power',
    key_point_media:'o_media',
    key_point_run_life:'ba_yunxingshijian',
    key_point_run_days:'ba_yunxingtianshu',
    key_point_run_hours:'ba_yunxingxiaoshishu',

    key_base:'baseInfo',
    key_exception:'exceptionInfo',
    key_mock:'mockInfo',
    key_setting:'settingInfo',
    key_start_stop:'startStopInfo',
    key_device:'deviceInfo',
    key_open_close:'openClose',
    key_count_fields:'countfields'
}
const media = {
  ReShui : 0,
  ZhengQi : 1,
  DaoReYou : 2,
  ReFeng : 3,
  ZhenKong : 4,
}
export default class sdcSoftDevice {
    static style_horizontal=0
    static style_vertical=1
    fieldMap={
        [deviceModel.key_base]:[],
        [deviceModel.key_exception]:[],
        [deviceModel.key_mock]:[],
        [deviceModel.key_setting]:[],
        [deviceModel.key_start_stop]:[],
        [deviceModel.key_device]:[],
        [deviceModel.key_open_close]:[],
        [deviceModel.key_count_fields]:[]
    }
    constructor(){
        this.deviceNo=''
        this.nickName = ""
        this.deviceType = ""
        this.commandsMap = {
          "设置参数" : [],
          "系统控制" : []
        }
        this.byteArrayLength=0
        this.deviceModel=deviceModel
        //modbus 设备编号
        this.modbusNo = 1
        this.powerVal = deviceModel.power_media_value_null
        this.mediaVal = deviceModel.power_media_value_null
    }
    /**
   * 初始命令分组集合
   * 提供点位表中定义的命令集合传入接口
   * @param {命令集合} map
   */
    initCommandsMapKeys(map){
        this.commandsMap = map
    }

    static byte_array_length

    addCommand(cmdGroupKey,cmd){
        if(this.commandsMap.hasOwnProperty(cmdGroupKey)){
            this.commandsMap[cmdGroupKey].push(cmd)
        }
    }
    /**
     * 添加数据点位
     * @param {meta数据点位对象} fields
     */
    addField(fields){
      if (null!=fields.getCommand()){
        this.addCommand(fields.commandGroupKey,fields.getCommand())
      }
      let deviceField = fields.getDeviceFieldForUI()
      if (null == deviceField) {
        return
      }
      for(let key in this.fieldMap){
          if(key==deviceField.key){
            this.fieldMap[key].push(deviceField)
          }
      }
    }
    getFieldsByGroupKey(key){
        for (let tempKey in this.fieldMap) {
            if(tempKey.indexOf(key)!=-1){
                return this.fieldMap[key]
            }
        }
    }
    getStoveElement(){
        let elementObj=new element("锅炉",element.prefix_stove)
        elementObj.setValues(element.index_a_power,this.getPower().value,this.getMedia().value,sdcSoftDevice.style_horizontal,this.getPowerInfo())
        return elementObj
    }
    getBaseInfoFields(){return this.getFieldsMap(deviceModel.key_base)}
    getExceptionFields(){return this.getFieldsMap(deviceModel.key_exception)}
    getMockFields(){return this.getFieldsMap(deviceModel.key_mock)}
    getSettingFields(){return this.getFieldsMap(deviceModel.key_setting)}
    getDeviceInfoFields(){return this.getFieldsMap(deviceModel.key_device)}
    getStartStopFields(){return this.getFieldsMap(deviceModel.key_start_stop)}
    getOpenCloseFields(){return this.getFieldsMap(deviceModel.key_open_close)}
    getCountFields(){return this.getFieldsMap(deviceModel.key_count_fields)}
    getUiItem(map,key){
      for (let tempKey in map) {
        if(tempKey.indexOf(key)!=-1){
          return this.fieldMap[key]
        }
      }
    }
    getExceptionCount(){
        return this.fieldMap[deviceModel.key_exception].length
    }
    getFieldsMap(fieldsGroupKey){
        let map={}
        let list=this.fieldMap[fieldsGroupKey]
        list.forEach(item=>{
            map[item.name]=item
        })
        return map
    }
    handleByteField(field,bytes=[]){}
    handleDeviceNo(bytes=[]){}
    getDeviceFocusFields(){}

    /**
     * 获取设备系统状态
     */
    getDeviceStatus(){
      return this.getBaseInfoFields()[deviceModel.key_point_system_status]
    }
    getMode(){}
    getPowerInfo(){}
    getPower(){return this.getBaseInfoFields()[deviceModel.key_point_power]}
    getMedia(){return this.getBaseInfoFields()[deviceModel.key_point_media]}
    validateByteLength(byteArrayLength){
        return this.byteArrayLength>byteArrayLength
    }
    getBeng(){}
    getFan(){}
    validateFalse(bytesLength){
      return sdcSoftDevice.byte_array_length>bytesLength
    }
    getCommands(){
      for (let i in this.commandsMap) {
        let cmds = this.commandsMap[i]
        for (let j in cmds) {
          cmds[j].modbusNo = this.modbusNo
        }
      }
      return this.commandsMap
    }
}

