import command from "./command";
import CRC16Util from "./CRC16Util";
import {getUnit16Number} from '../../utils/dataparse'

export default class intCommand extends command{
    constructor(){
        super()
        this.valueType = command.int_value
    }
    handleValue(...values){
      let self = this
        let i = Number.parseInt(values[0])
        this.valueString = i.toString()
        //this.value = String.format("%04x",i)
        let value = i.toString(16)
        while (value.length<4) {
          value="0"+value
        }
        this.value = value
    }
    convertToString(){
        let modbusNo = this.modbusNo.toString(16)
        while (modbusNo.length < 2) {
          modbusNo = "0"+modbusNo
        }
        let baseStr = modbusNo + this.action + this.address + this.value
        /*let baseStr = String.format(
            "%s%s%s%s",
            //String.format("%02x",this.modbusNo),
            this.action,
            this.address,
            this.value
        )*/
        let data = command.toBytes(baseStr)
        return baseStr+CRC16Util.getCrc(CRC16Util.calcCrc16(data))+"0000000000"
        /*return String.format("%s%s0000000000",baseStr,CRC16Util.getCrc(CRC16Util.calcCrc16(data)))*/
    }
}
