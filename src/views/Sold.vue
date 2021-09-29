<template>
  <div class="sold">
    <div></div>
    <el-row>
      <el-col :span="7" :xs="24">
        <div class="readme">
          <div class="flex jcs">
            <h2 style="text-align:left">说明</h2>
            <div>
              <el-popover placement="bottom" :title="'当前汇率 - '+ (nowRate.date?this.nowRate.date:'2020/3/26')" width="300" trigger="hover">
                <div>
                  <div>更新汇率后会自动缓存到当前汇率信息到浏览器 <br>
                    <el-button size="mini" @click="delRate">清除缓存,使用默认汇率</el-button>
                  </div>
                  <br>
                  <div>1 RMB = 马来 {{nowRate.my}} MYR</div>
                  <div>1 RMB = 印尼 {{nowRate.id}} IDR</div>
                  <div>1 RMB = 泰国 {{nowRate.th}} THB</div>
                  <div>1 RMB = 台湾 {{nowRate.tw}} TWD</div>
                  <div>1 RMB = 越南 {{nowRate.vn}} VND</div>
                  <div>1 RMB = 菲律宾 {{nowRate.ph}} PHP</div>
                  <div>1 RMB = 新加坡 {{nowRate.sg}} SGD</div>
                </div>
                <span style="margin-right:15px;font-size:15px;" class="cup" slot="reference">当前汇率</span>
              </el-popover>
              <el-button :loading="rateState" :type="ruaa" :icon="rua" round @click="updataRate()">{{(!this.rate_err?'更新汇率':"更新失败")}}</el-button>
            </div>
          </div>
          <div style="text-align:left">
            <p><b>订单收入</b> - 后台订单页面的实际订单收入</p>
            <p style="font-size:15px">计算公式为: <br />产品售价 - 卖家支付运费 - 佣金 - 活动服务费 - 交易手续费</p>
          </div>
          <el-divider></el-divider>
          <div style="text-align:left">
            <p><b>藏价</b> - 卖家承担运费</p>
            <p style="font-size:15px">根据重量自动计算出各站点藏价</p>
          </div>
          <el-divider></el-divider>
          <div style="text-align:left">
            <p><b>手续费</b> - Shopee费用与收费</p>
            <p style="font-size:15px">交易手续费-Transaction Fee: <br>收取买家支付部分的2% (产品价格+买家支付运费) </p>
          </div>
          <el-divider></el-divider>
          <div style="text-align:left">
            <p><b>免运选项</b></p>
            <p style="font-size:15px">免运手续费为产品售价的 5% , 马来站点 4%, <br />与自定义活动手续费一并记入服务费Service Fee<br /> <br />如果买家使用免运券, 则交易手续费变更为(产品价格的 2%)</p>
          </div>
        </div>
      </el-col>
      <el-col :span="10" :xs="24">
        <div class="left">
          <el-row type="flex" class="mb-22" justify="center" :gutter="20">
            <el-col :span="24">
              <h2 style="color:#ee4d2d">SHOPEE 在线定价工具</h2>
              <el-popover placement="bottom" title="更新日志" width="200" trigger="click" heigth='100'>
                <div>
                  <br>2020/7/20<br>
                  <br>-越南站点SLS-Standard Express运费下调<br>
                </div>
                <el-divider slot="reference"><span style="cursor: pointer;">2020/7/20更新</span></el-divider>
              </el-popover>
            </el-col>
          </el-row>
          <el-row type="flex" class="mb-22" justify="center" :gutter="20">
            <el-col :span="12" style="transform: translateX(20px);">
              <el-cascader v-model="forms" :options="options" :props="{ expandTrigger: 'hover' }"></el-cascader>
            </el-col>
            <el-col :span="12" class="idtex" v-model="off" label="yin">
              <span style="font-size:14px; margin: 0 12px;line-height: 19px;">
                <b>折扣</b>
                <el-tooltip effect="dark" class="cup" placement="top">
                  <div slot="content">用于计算折前定价</div>
                  <i class="el-icon-question" style="transform: translateY(-3px);"></i>
                </el-tooltip>
              </span>
              <el-input class="idtex-box" v-model="off">
                <template slot="append">%</template>
              </el-input>
            </el-col>
          </el-row>
          <el-row type="flex" class="mb-22" justify="center" :gutter="20">
            <el-col :span="24" class="idtex">

              <el-checkbox v-model="newShop">免佣期</el-checkbox>
              <el-checkbox v-model="newYun">参加免运活动</el-checkbox>
              <span v-show="forms[0]=='br'" style="font-size:14px;color:#606266">巴西汇损 5%
                <el-tooltip effect="dark" class="cup" placement="top">
                  <div slot="content">因巴西货币转出会产生相关费用，收款时巴西雷亚尔到美金的汇率将
                    会产生 5%汇率损失，<br />因此卖家在设置巴西自营店铺产品价格时，需要多增加 5%藏
                    价。<br /></div>
                  <i class="el-icon-question" style="transform: translateY(-3px);"></i>
                </el-tooltip>
              </span>
              <el-checkbox v-model=" buyyun" v-show="newYun&&tog==2">买家未使用免运券
                <el-tooltip effect="dark" class="cup" placement="top">
                  <div slot="content">用于精确计算订单实际利润<br /></div>
                  <i class="el-icon-question" style="transform: translateY(-3px);"></i>
                </el-tooltip>
              </el-checkbox>
            </el-col>

          </el-row>
          <el-row type="flex" class="mb-22" justify="center" :gutter="0">
            <el-col :span="12" class="idtex" v-model="idt" label="yin" v-show="forms[0] =='id'">
              <span style="font-size:14px; margin: 0 12px;line-height: 19px;">
                <b>印尼税率</b>
                <el-tooltip effect="dark" class="cup" placement="top">
                  <div slot="content">3 美金以下包裹征收 10 % 税率<br />3 美金 以上包裹请根据类目填写<br />对定价无影响，影响前台买家看到的价格</div>
                  <i class="el-icon-question" style="transform: translateY(-3px);"></i>
                </el-tooltip>
              </span>
              <el-input size="mini" class="idtex-box" v-model="idt">
                <template slot="append">%</template>
              </el-input>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" :gutter="20" class="mb-22">
            <el-col :span="8">
              <div class="grid-content bg-purple-dark tr">
                采购价格
              </div>
            </el-col>
            <el-col :span="16">
              <div class="grid-content bg-purple-dark">
                <el-input v-model="huo" placeholder="拿货价" clearable v-direction="{x: 0, y: 0}">
                  <template slot="append">RMB</template>
                </el-input>
              </div>
            </el-col>
          </el-row>

          <el-row type="flex" justify="center" :gutter="20" class="mb-22">
            <el-col :span="8">
              <div class="grid-content bg-purple-dark tr posr">
                <span class="posa tabrmb" v-show="tog == 2">约等于 {{(shopee / rate.hl).toFixed(2)}}RMB</span>
                <span :class="['posa',{tranl:tog==2,grey:tog==1}]" @click="thistog(2)">售价</span>
                <span :class="['posa',{tranl:tog==1,grey:tog==2}]" @click="thistog(1)">利润</span>
                <el-tooltip effect="dark" class="cup" content="模式1: 根据利润得出产品售价" placement="top" v-show="tog==1">
                  <i class="el-icon-question" style="transform: translateY(-3px);"></i>
                </el-tooltip>
                <el-tooltip effect="dark" class="cup" content="模式2: 根据输入产品售价得出产品利润,可精确计算出一单的利润" placement="top" v-show="tog==2">
                  <i class="el-icon-question" style="transform: translateY(-3px);"></i>
                </el-tooltip>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="grid-content bg-purple-dark">
                <el-input v-model="shopeeInput" placeholder="Shopee售价" v-direction="{x: 0, y: 1}" v-show="tog==2">
                  <template slot="append">
                    <span>{{rate.bi}}</span>
                    <span v-show="tog==1">RMB</span>
                  </template>
                </el-input>
                <el-input v-model="newLi" placeholder="利润" clearable v-direction="{x: 0, y: 1}" v-show="tog==1">
                  <template slot="append">
                    <span>RMB</span>
                  </template>
                </el-input>
              </div>
            </el-col>
          </el-row>

          <el-row type="flex" justify="center" :gutter="20" class="mb-22">
            <el-col :span="8">
              <div class="grid-content bg-purple-dark tr">
                包裹重量
              </div>
            </el-col>
            <el-col :span="16">
              <div class="grid-content bg-purple-dark">
                <!-- <el-input-number v-model="kg" controls-position="right" :min="10" :max="50" step="10"></el-input-number> -->
                <el-input v-model="kg" placeholder="重量" clearable v-direction="{x: 0, y: 2}">
                  <template slot="append"> g </template>
                </el-input>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" :gutter="20" class="mb-22">
            <el-col :span='8'>
              <div class="grid-content bg-purple-dark tr">
                国内运费
              </div>
            </el-col>
            <el-col :span='16'>
              <div class="grid-content bg-purple-dark">

                <el-input v-model="gy" placeholder="国内运费" clearable v-direction="{x: 0, y: 3}">
                  <template slot="append">RMB</template>
                </el-input>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" :gutter="20" class="mb-22">
            <el-col :span="8">
              <el-tooltip effect="dark" class="cup" content="若没有报活动则不需要填写" placement="right">
                <div class="grid-content bg-purple-dark tr">
                  活动手续费
                </div>
              </el-tooltip>
            </el-col>
            <el-col :span="16">
              <div class="grid-content bg-purple-dark ">
                <el-input v-model="hd" placeholder="活动手续费百分比" clearable v-direction="{x: 0, y: 4}">
                  <template slot="append">%</template>
                </el-input>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" :gutter="20" class="mb-22">

            <el-col :span="8">
              <el-tooltip effect="dark" class="cup" content="第三方提现所需的费用/记入成本" placement="right">
                <div class="grid-content bg-purple-dark tr">
                  提现手续费
                </div>
              </el-tooltip>
            </el-col>
            <el-col :span="16">
              <div class="grid-content bg-purple-dark ">
                <el-input v-model="tx" placeholder="提现手续费百分比" clearable v-direction="{x: 0, y: 5}">
                  <template slot="append">%</template>
                </el-input>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="7" :xs="24">
        <div class="right">
          <div class="flex jc">
            <h2>计算结果</h2>
          </div>

          <div class="flex jc mtb5" style="font-size:15px">
            <div class="fx1"><b>利润率</b></div>
            <div class="fx1 "><b>{{lv}}</b></div>
          </div>

          <div class="flex jc mtb5 posr" style="font-size:15px">
            <!-- 最终利润 = 订单收入 * 汇率 - 采购价格 - 国内运费 - 提现手续费 -->
            <div :class="['fx1',{rightOn:tog==2,rightOff:tog==1}]" v-show="tog==2"><b>产品利润</b></div>
            <div :class="['fx1',{rightOn:tog==1,rightOff:tog==2}]" v-show="tog==1"><span><b>产品售价</b></span></div>
            <div class="fx1 ">
              <span v-show="tog==1"><b>{{shopee}} {{rate.bi}}</b></span>
              <span v-show="tog==2"><b>{{li}} RMB</b></span>
            </div>
          </div>

          <div class="flex jc mtb5" style="font-size:15px">
            <div class="fx1"><b>折前定价</b></div>
            <div class="fx1 "><b>{{thisOff}} {{rate.bi}}</b></div>
          </div>

          <div class="flex jc mtb5" v-show="forms[0] =='id'" style="font-size:15px">
            <div class="fx1"><b>印尼税后前台价格</b></div>
            <div class="fx1 "><b>{{idx.toFixed(0)}} {{rate.bi}}</b></div>
          </div>

          <div class="flex jc mtb5" style="font-size:15px">
            <el-tooltip effect="dark" class="cup" placement="top">
              <div slot="content">扣除虾皮收取费用和运费后的最终收入<br />订单收入=产品售价 - 卖家支付运费 - 佣金 - 活动服务费 - 交易手续费</div>
              <div class="fx1"><b>订单收入</b></div>
            </el-tooltip>
            <div class="fx1 "><b>{{real}} {{rate.bi}}</b></div>
          </div>

          <div class="flex jc">
            <h2>详细费用</h2>
          </div>

          <div class="flex jc mtb5" style="font-size:15px">
            <el-tooltip effect="dark" class="cup" content="买家和卖家承担的运费总额" placement="top">
              <div class="fx1"><b>运费总额</b></div>
            </el-tooltip>
            <div class="fx1"><b>{{(ship*1 + buyShip*1).toFixed(2)}} {{rate.bi}}</b></div>
          </div>
          <div class="flex jc mtb5">
            <el-tooltip effect="dark" class="cup" content="根据重量计算出的卖家运费" placement="top">
              <div class="fx1">卖家承担运费</div>
            </el-tooltip>
            <div class="fx1 ">{{ship}} {{rate.bi}}</div>
          </div>
          <div class="flex jc mtb5 mb-30">
            <el-tooltip effect="dark" class="cup" content="买家根据地区支付的运费" placement="top">
              <div class="fx1" v-show="!newYun">买家承担运费</div>
            </el-tooltip>
            <el-tooltip effect="dark" class="cup" content="免运活动shopee回馈运费" placement="top">
              <div class="fx1" v-show="newYun">虾皮回馈运费</div>
            </el-tooltip>
            <div class="fx1 ">{{buyShip}} {{rate.bi}}</div>
          </div>
          <div class="flex jc mtb5" style="font-size:15px;margin-top: 30px;">
            <div class="fx1"><b>Shopee费用与收费</b></div>
            <div class="fx1"><b>{{(yongjin.f1*1+yongjin.f2*1+yongjin.f3*1+yongjin.f4*1).toFixed(2)}} {{rate.bi}}</b></div>
          </div>
          <div class="flex jc mtb5">
            <div class="fx1">Commission Fee
              <el-tooltip effect="dark" class="cup" placement="top" content="佣金: Shopee将索取您的商品价格的 6.00% 作为佣金">
                <i class="el-icon-question" style="transform: translateY(-3px);"></i>
              </el-tooltip>
            </div>
            <div class="fx1 ">{{yongjin.f2}} {{rate.bi}}</div>
          </div>
          <div class="flex jc mtb5 mb-30">
            <div class="fx1">Service Fee
              <el-tooltip effect="dark" class="cup" content="服务费" placement="top">
                <i class="el-icon-question" style="transform: translateY(-3px);"></i>
              </el-tooltip>
            </div>
            <div class="fx1 ">{{(yongjin.f3*1+yongjin.f4*1).toFixed(2)}} {{rate.bi}}</div>
          </div>
          <div class="flex jc mtb5">
            <div class="fx1">Transaction Fee
              <el-tooltip effect="dark" class="cup" content="交易手续费: 买家支付费用的 2%" placement="top">
                <i class="el-icon-question" style="transform: translateY(-3px);"></i>
              </el-tooltip>
            </div>
            <div class="fx1 ">{{yongjin.f1}} {{rate.bi}}</div>
          </div>
          <div class="flex jc mtb5" style="font-size:15px;margin-top: 30px;">
            <div class="fx1"><b>第三方费用总和</b></div>
            <div class="fx1 "><b>{{yongjin.f5}} {{rate.bi}}</b></div>
          </div>
          <div class="flex jc mtb5">
            <el-tooltip effect="dark" class="cup" content="提现手续费,自动换算并记入成本" placement="top">
              <div class="fx1">提现手续费</div>
            </el-tooltip>
            <div class="fx1 ">{{yongjin.f5}} {{rate.bi}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="product" style="display:none">
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            <div class="pri">
              <b>全站点藏价工具</b>
            </div>
          </template>
          <div class="colum">
            <div class="vitem" v-for="(all,index) in price" :key="index">

            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { cornsilk } from 'color-name'
import ls from '../../public/local'
export default {
  data () {
    return {
      tog: 2, //模式 1 | 模式 2
      shopeeInput: 10, //shopee售价
      huo: 10, //采购价
      kg: 50,// 单位 g
      gy: 0.5,// 国内运费
      newLi: 5, //利润 值
      rate_err: false,//汇率更新成功与失败.false成功 | ture失败
      rua: "",//实时汇率加载动画后✔
      ruaa: "",//实时汇率颜色
      rateState: false, //汇率加载动画
      nowRate: {
        //默认的手动更新的汇率
        date: '2020 - 03 - 26',
        my: 0.62134,
        ph: 7.186922,
        sg: 0.20396,
        id: 2311.462648,
        th: 4.625522,
        tw: 4.266961,
        vn: 3293.54,
        br: 0.705902,
      },//实时汇率
      tli: '',//实际利润
      inputLi: '',//输入框利润
      forms: ['my', 5.2],
      form: 'my',
      hd: 0,//活动手续费
      tx: 0,//提现手续费
      off: 50,//折扣
      buyyun: false,
      idt: 10,//印尼税率
      phg: 5,
      phgb: false,//拒收率-已弃用
      newShop: false,
      newYun: false,
      price: [
        {
          name: "马来西亚",
          inputG: '',
          buyerFee: '',
          sellerFee: '',
        }
      ],
      options: [{ //选项卡选项
        value: "my", label: "马来西亚",
        children: [{
          value: 5.2, label: "KV区-SLS"
        }, {
          value: 6, label: "NON KV区-SLS"
        }, {
          value: 6, label: "B区-SLS"
        }, {
          value: 6, label: "C区-SLS"
        },]
      }, {
        value: "ph", label: "菲律宾",
        children: [{
          value: 50, label: "A区-SLS"
        }, {
          value: 65, label: "B区-SLS"
        }, {
          value: 100, label: "C区-SLS"
        }]
      }, {
        value: "sg", label: "新加坡",
        children: [{
          value: 1, label: "Standard Express"
        }, {
          value: 0, label: 'Standard Economy'
        }]
      }, {
        value: "id", label: "印尼",
        children: [{
          value: 12000, label: "A区-SLS"
        }, {
          value: 30000, label: "B区-SLS"
        }, {
          value: 50000, label: "C区-SLS"
        }]
      }, {
        value: "tw", label: "台湾",
        children: [{
          value: 60, label: "普货"
        }, {
          value: 70, label: "特货"
        }]
      }, {
        value: "th", label: "泰国",
        children: [{
          value: 30, label: "A区-SLS"
        }, {
          value: 30, label: "B区-SLS"
        }, {
          value: 230, label: "C区-SLS"
        }, {
          label: "泰国A B区买家运费一致",
          disabled: true
        }]
      }, {
        value: "vn", label: "越南",
        children: [{
          value: 10000, label: "A1区-SLS"
        }, {
          value: 17000, label: "A2区-SLS"
        }, {
          value: 17000, label: "B1区-SLS"
        }, {
          value: 30000, label: "B2区-SLS"
        }]
      }, {
        value: "br", label: "巴西",
        children: [{
          value: 8, label: "买家固定每单 8 BRL"
        }]
      }]
    }
  },
  computed: {
    mykv () {
      return this.kg > 800 ? Math.ceil((this.kg - 249) / 250) * 2.2 + 5.2 : 5.2
    },
    mynonkv () {
      if (this.kg < 800) {
        return 6
      } else {
        return Math.ceil((this.kg - 249) / 250) * 2.2 + 5.2
        //每五百30 
      }
    },
    shopee: {
      //shopee商品售价
      get () {
        if (this.tog == 2) {
          //tog 1 由售价计算利润
          //tog 2 由利润计算售价
          return this.shopeeInput //输入售价的值
        }
        return this.newSold // 
      },
      set (n) {
        this.shopeeInput = n
      }
    },
    // 由利润计算售价/公式
    newSold: {
      get () {
        let newli = this.newLi//利润值
        let huo = this.huo
        let gy = this.gy
        let form = this.forms[0]
        let allfee = ((this.newLi * 1 + this.huo * 1 + this.gy * 1) * this.rate.hl)
        //交易手续费
        console.log((this.newYun ? 0 : this.forms[1]))
        let planA = ((allfee + (this.newYun ? 0 : this.forms[1]) * 1) / (92 / 2))
        //卖家承担运费
        let planD = this.ship * 1
        //佣金
        let planC = this.newShop ? 0 : ((allfee + planD) / (92 / 6))
        //服务费(免运活动)
        let planE
        if (this.newYun === true) {
          if (form === 'my' || form === 'sg' || form === 'br') {
            planE = form === 'my' ? (allfee / (92 / 4)).toFixed(2) : (allfee / (92 / 5)).toFixed(2)
          } else {
            planE = (allfee / (92 / 5)).toFixed(0)
          }
        } else {
          planE = 0
        }
        console.log("交易手续费", planA.toFixed(2), ";佣金:", planC.toFixed(2), ";卖家承担运费", planD, ";服务费/免运费:", planE, ";扣除的所有费用:", allfee)
        //产品售价
        if (form === 'my' || form === 'sg' || form === 'br') {
          return (allfee + (planA * 1 + planC * 1 + planD)).toFixed(2)
        } else {
          return (allfee + (planA * 1 + planC * 1 + planD)).toFixed(0)
        }
      }
    },
    thisOff () {
      return (this.shopee / (1 - this.off / 100)).toFixed(2)
    },
    back () {
      let form = this.forms[0]
      return form == 'my' || form == 'sg' ? false : true
    },

    idx () {
      //针对id收税情况
      if (this.idt == 0) {
        return this.shopee
      }
      return this.shopee * 1 + (this.shopee * (this.idt / 100))
    },
    myBuyer () {
      if (this.kg > 1000) {

      }
    },
    ship () {
      //卖家承担运费判断
      const form = this.forms[0]
      if (form == 'my') {
        return this.shipMY()
      } else if (form == "sg") {
        return this.shipSG()
      } else if (form == "id") {
        return this.shipID()
      } else if (form == "th") {
        return this.shipTH()
      } else if (form == "tw") {
        return this.shipTW()
      } else if (form == "ph") {
        return this.shipPH()
      } else if (form == "vn") {
        return this.shipVN()
      } else if (form == "br") {
        return this.shipBR()
      }
    },
    buyShip () {
      // 买家承担运费
      if (this.form == 'my') {
        if (this.forms[1] == 5.2) {
          return this.kg > 800 ? (Math.ceil((this.kg - 799) / 250) * 2.2 + 5.2).toFixed(2) : 5.2
        }
        if (this.forms[1] == 6) {
          return this.kg > 800 ? (Math.ceil((this.kg - 799) / 250) * 2.2 + 6).toFixed(2) : 6
        }
      }
      return this.forms[1]

    },

    real () {
      //订单收入
      let p = this.yongjin
      return (this.shopee - this.ship - (p.f1 * 1 + p.f2 * 1 + p.f3 * 1 + p.f4 * 1)).toFixed(2)
    },
    new () {
      //免佣期间和佣金费用
      let form = this.forms[0]
      if (this.newShop === true) {
        return 0
      } else {
        if (form === 'my' || form === 'sg' || form === 'br') {
          return (this.shopee * 0.06).toFixed(2)
        } else {
          return (this.shopee * 0.06).toFixed(0)
        }
      }
    },
    jiaoyi () {
      //交易手续费公式
      let form = this.forms[0]
      let form1 = this.forms[1]
      if (this.newYun === false || this.buyyun === true) {
        if (form === 'my' || form === 'sg' || form === 'br') {
          return ((this.shopee * 1 + form1 * 1) * 0.02).toFixed(2)
        } else {
          return ((this.shopee * 1 + form1 * 1) * 0.02).toFixed(0)
        }
      } else {
        if (form === 'my' || form === 'sg' || form === 'br') {
          return (this.shopee * 0.02).toFixed(2)
        } else {
          return (this.shopee * 0.02).toFixed(0)
        }
      }
    },
    yun () {
      //是否免运 扣除的服务费
      let form = this.forms[0]
      if (this.newYun === true) {
        if (form === 'my' || form === 'sg' || form === 'br') {
          return form === 'my' ? (this.shopee * 0.04).toFixed(2) : (this.shopee * 0.05).toFixed(2)
        } else {
          return (this.shopee * 0.05).toFixed(0)
        }
      } else {
        return 0
      }
    },
    hdhot () {
      //活动手续费
      let form = this.forms[0]
      if (form === 'my' || form === 'sg' || form === 'br') {
        return this.shopee * (this.hd / 100).toFixed(2)
      } else {
        return (this.shopee * (this.hd / 100)).toFixed(0)
      }
    },
    yongjin () {
      //shopee扣除的所有费用总和
      return {
        f1: this.jiaoyi, //交易手续费
        f2: this.new, //佣金
        f3: this.yun, //服务费
        f4: this.hdhot, //活动手续费
        f5: this.shopee * (this.tx / 100).toFixed(2), //提现手续费
      }
    },
    rate: {
      //汇率计算 币种
      get () {
        let form = this.forms[0]
        if (form === 'my') {
          return {
            hl: this.nowRate.my,
            bi: 'MYR'
          }
        } else if (form == 'ph') {
          return {
            hl: this.nowRate.ph,
            bi: 'PHP'
          }
        } else if (form == 'sg') {
          return {
            hl: this.nowRate.sg,
            bi: 'SGD'
          }
        } else if (form == 'id') {
          return {
            hl: this.nowRate.id,
            bi: 'IDR'
          }
        } else if (form == 'th') {
          return {
            hl: this.nowRate.th,
            bi: 'THB'
          }
        } else if (form == 'tw') {
          return {
            hl: this.nowRate.tw,
            bi: 'TWD'
          }
        } else if (form == 'vn') {
          return {
            hl: this.nowRate.vn,
            bi: 'VND'
          }
        } else if (form == 'br') {
          return {
            hl: this.nowRate.br,
            bi: 'BRL'
          }
        }
      }
    },
    li: {
      //实际利润
      get () {
        let l
        return this.tli = ((this.real / this.rate.hl) - this.huo - this.gy - (this.yongjin.f5 / this.rate.hl) - (this.phgb ? ((this.shopee * 1) * (this.phg / 100)) : 0)).toFixed(2)
      }
    },
    lv: {
      //利润率
      get () {
        if (this.shopee !== '' && this.huo !== '')
          return ((this.li / this.huo) * 100).toFixed(0) + "%"
      },
      set (val) {
        this.real
      }
    },
  },
  methods: {
    shipVN (item) {
      let box
      box = item ? item : this.kg
      //卖家承担运费
      return 900 * Math.ceil(Math.ceil(this.kg) / 10)
    },
    shipBR (item) {
      let box
      box = item ? item : this.kg
      //卖家承担运费
      let top = 3//首重 30 - 3br
      if (this.kg <= 30) {
        return top
      } else {
        if (this.kg <= 100) {
          return (1.4 * (Math.ceil(Math.ceil(this.kg - 30) / 10)) + top).toFixed(2)
        } else {
          return (0.9 * Math.ceil(Math.ceil(this.kg - 30) / 10) + top).toFixed(2)
        }
        //每五百30 
      }
    },
    shipTW (item) {
      let box
      box = item ? item : this.kg
      //卖家承担运费
      if (this.kg < 500) {
        return 15
      } else {
        return Math.ceil((this.kg - 499) / 500) * 30 + 15
        //每五百30 
      }
    },
    shipTH (item) {
      let box
      box = item ? item : this.kg
      //卖家承担运费
      return 2 * Math.ceil(Math.ceil(this.kg) / 10)
    },
    shipID (item) {
      let box
      box = item ? item : this.kg
      //卖家承担运费
      return 1200 * Math.ceil(Math.ceil(this.kg) / 10)
    },
    shipSG (item) {
      let box
      box = item ? item : this.kg
      //卖家承担运费
      if (this.kg <= 50) {
        return 0.6
      } else {
        return (0.12 * Math.ceil(this.kg - 50) / 10 + 0.6).toFixed(2)
      }
    },
    shipMY (item) {
      let box
      box = item ? item : this.kg
      //卖家承担运费
      return this.kg == 10 ? 0.15 : (0.15 * Math.ceil(Math.ceil(this.kg) / 10)).toFixed(2)
    },
    shipPH (item) {
      let box
      box = item ? item : this.kg
      //卖家承担运费
      if (this.kg <= 50) {
        return 23
      } else {
        return Math.ceil(Math.ceil(this.kg - 50) / 10 * 4.5) + 23
      }
    },
    thistog (e) {
      this.tog = e
    },
    updataRate () {
      this.rateState = true
      this.$axios.get('https://api.exchangerate-api.com/v4/latest/CNY').then(res => {
        this.rateState = false
        //按钮样式
        this.ruaa = 'success'
        this.rua = "el-icon-check"
        this.nowRate.my = res.data.rates.MYR
        this.nowRate.ph = res.data.rates.PHP
        this.nowRate.sg = res.data.rates.SGD
        this.nowRate.id = res.data.rates.IDR
        this.nowRate.th = res.data.rates.THB
        this.nowRate.tw = res.data.rates.TWD
        this.nowRate.br = res.data.rates.BRL
        this.nowRate.date = res.data.date
        //存入local
        ls.set("rate", this.nowRate)
        console.log(res.data.rates)
      }).catch(error => {
        this.rateState = false
        this.ruaa = 'warning'
        this.rua = "el-icon-warning-outline"
        this.rate_err = true
        console.log(error, "汇率接口API地址可能挂了,检查一下(https://api.exchangerate-api.com/v4/latest/CNY)")
      })
    },

    delRate () {
      ls.remove("rate")
    },
    formatInt (num, prec = 2, ceil = true) {
      const len = String(num).length;
      if (len <= prec) { return num };
      const mult = Math.pow(10, prec);
      return ceil ?
        Math.ceil(num / mult) * mult :
        Math.floor(num / mult) * mult;
    },
    Fee (form) {
      let forms = this.forms[0]
      let p = this.yongjin
      let form1 = form.replace(/"/g, '')
      console.log(form1)
      return p.form1.f5
    },
  },
  created: function () {
    if (!ls.get("rate")) {
      console.log("汇率数据没有存进local")
    } else if (ls.get("rate")) {
      console.log("汇率数据已存入local")
      this.nowRate = ls.get("rate")
    }
    let direction = this.$getDirection()
    direction.on('keydown', function (e, val) {
      //左右
      // if (e.keyCode === 39) {
      //   direction.next()
      // }
      // if (e.keyCode === 37) {
      //   direction.previous()
      // }
      if (e.keyCode === 38) {
        direction.previousLine()
      }
      if (e.keyCode === 40) {
        direction.nextLine()
      }
      if (e.keyCode === 13) {
        direction.nextLine()
      }
    })


  },
  components: {

  }
}
</script>
<style lang='scss' scoped>
/* .el-row {
  flex-direction: column;
} */

.tabrmb {
  top: 3px;
  width: 90%;
  z-index: 9;
  left: 284px;
  font-size: 14px;
  color: #b5b5b5;
  cursor: default;
}

.pri {
  text-align: center;
  margin: 0 20px;
  font-size: 20px;
}

* {
  transition: 0.3s all;
}

.readme {
  b {
    color: #ee4d2d;
  }
}

.tranl {
  font-size: 16px;
  right: 15px;
}
.tranl2 {
  transform: translateX(10px);
}

.grey {
  color: #bbb;
  cursor: pointer;
  right: 55px;
  &:hover {
    text-shadow: #bbb;
  }
}

.el-icon-question {
  color: rgba(0, 0, 0, 0.2);
  transform: translateY(-3px);
}

.idtex {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  span.ti {
    position: absolute;
    top: -20%;
    left: 18%;
    z-index: 55;
    background: rgb(249, 249, 249);
  }
  .el-input-group__append {
    padding: 0 10px;
  }
  .idtex-box {
    width: 160px;
  }
}

.sold {
  width: 1280px;
  margin: 10px auto 50px auto;
  border-radius: 15px;
  box-shadow: 1px 1px 7px 5px #e0e0e0;
}

.readme {
  background: rgb(255, 255, 255);
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  padding: 15px;
}

.right,
.left,
.readme {
  // border: 1px solid rgb(201, 201, 201);
  height: 650px;
}

.left {
  padding: 15px;
  background: rgb(249, 249, 249);
}

.right {
  background: #fff;
  font-size: 13px;
  padding: 15px 20px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}

.posr {
  position: relative;
}

.posa {
  position: absolute;
}

.mb-22 {
  margin-bottom: 22px;
}

.mb-30 {
  margin-bottom: 30px;
}

.tr {
  text-align: right;
  line-height: 2.5;
}

.tar {
  text-align: right;
}

.b1 {
  border-bottom: 1px solid #bbb;
}

.tran {
  transform: translateX(-30px);
}

.flex {
  display: flex;
  align-items: center;
  align-content: center;
}

.jc {
  justify-content: center;
}

.jcs {
  justify-content: space-between;
}

.fx1 {
  flex: 1;
}

.mtb5 {
  margin: 15px 0;
}
.cup {
  cursor: pointer;
}

.el-icon-question {
  transform: translate(1px, 1px);
}

@media (max-width: 880px) {
  .sold {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .left {
    height: 100%;
  }
}

@media (max-width: 500px) {
}
.check1 {
  transform: translate(29px, -52px);
}
/* .check1 {
  transform: translate(180px, -51px);
} */
</style>
