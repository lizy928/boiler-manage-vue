"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ZH_CN_1 = require("./ZH_CN");
var PLC = /** @class */ (function (_super) {
    __extends(PLC, _super);
    function PLC() {
        var _this = _super.call(this) || this;
        _this.addCommandGroup(PLC.Commands_Key_Parameters_Setting);
        _this.addCommandGroup(PLC.Commands_Key_System_Ctl);
        return _this;
        /*
                this.addPoint(new BaseInfoField(SdcSoftDevice.KEY_POINT_RUN_HOURS, 9, 2, "运行小时数", "时"));
                this.addPoint(new BaseInfoField(SdcSoftDevice.KEY_POINT_RUN_DAYS, 11, 2, "运行天数", "天"));
                this.addPoint(new BaseInfoField(SdcSoftDevice.KEY_POINT_SYSTEM_STATUS, 13, 2, "系统状态", '', PLC.coms_status));
                this.addPoint(new BaseInfoField("ba_shuiweizhuangtai", 19, 2, "水位状态", '', ParentClass.coms_level));
                this.addPoint(new BaseInfoField("ba_ranshaoqizhuangtai", 21, 2, "燃烧器状态", '', PLC.coms_ranshaoqi_status));
            */
    }
    PLC.Commands_Key_Parameters_Setting = "参数设置";
    PLC.Commands_Key_System_Ctl = "系统控制";
    PLC.coms_status = {
        0: "待命",
        1: "运行",
        2: "报警",
    };
    PLC.coms_atuo = {
        0: "自",
        1: "手",
    };
    PLC.coms_ranshaoqi_status = {
        0: "停",
        1: "运行",
        2: "大火"
    };
    return PLC;
}(ZH_CN_1.ZH_CN));
exports.PLC = PLC;
