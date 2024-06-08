/**
 * 界面上商品的类
 */
class UIGoods {
  constructor(goodsInfo) {
    Object.defineProperty(this, "goodsInfo", {
      get() {
        return goodsInfo;
      },
      set() {
        throw new Error("goodsInfo属性是只读的，不允许修改");
      },
    });

    this.choose = 0;
  }

  increase() {
    this.choose += 1;
  }

  decrease() {
    if (this.choose == 0) {
      return;
    }
    this.choose -= 1;
  }

  getTotalPrice() {
    return this.choose * this.goodsInfo.price;
  }

  isChoose() {
    return this.choose > 0;
  }
}

/**
 * 界面上的数据类
 */
class UIData {
  constructor(goodsList) {
    /**
     * 商品列表
     */
    this.uiGoodsList = [];
    goodsList.forEach((item) => {
      this.uiGoodsList.push(new UIGoods(item));
    });

    /**
     * 配送费
     */
    this.distributionFee = 5;

    /**
     * 起送费
     */
    this.distributionMinPrice = 60;
  }

  decrease(index) {
    this.uiGoodsList[index].decrease();
  }

  increase(index) {
    this.uiGoodsList[index].increase();
  }

  getTotalPrice() {
    let total = 0;
    this.uiGoodsList.forEach((item) => {
      total += item.getTotalPrice();
    });
    return total + this.distributionFee;
  }

  getTotalChooseCount() {
    let total = 0;
    this.uiGoodsList.forEach((item) => {
      total += item.choose;
    });
    return total;
  }

  isChoose() {
    return this.getTotalChooseCount() > 0;
  }

  canDistribute() {
    let result = {
      flag: false,
      dis: 0,
    };
    let totalPrice = this.getTotalPrice();
    result.dis = totalPrice - this.distributionMinPrice;

    result.flag = result.dis >= 0;

    return result;
  }
}

class UI {
  constructor(goods) {
    this.uiData = new UIData(goods);
    this.doms = {
      goodsContainer: document.querySelector(".goods-list"),
      footerPay: document.querySelector(".footer-pay"),
      footerCarTip: document.querySelector(".footer-car-tip"),
      footerCarTotal: document.querySelector(".footer-car-total"),
      footerCar: document.querySelector(".footer-car"),
    };

    this.createGoodsElements();

    //起送费
    this.doms.footerCarTip.textContent = `配送费￥${this.uiData.distributionFee}`;

    this.listenEvent();
  }

  listenEvent() {
    this.doms.footerCar.addEventListener("animationend", function () {
      this.classList.remove("animate");
    });

    this.doms.goodsContainer.addEventListener("click", (e) => {
      let increaseFlag = e.target.classList.contains("i-jiajianzujianjiahao");
      let decreaseFlag = e.target.classList.contains("i-jianhao");

      let index = e.target.getAttribute("index");

      if (increaseFlag) {
        this.increase(index);
      }

      if (decreaseFlag) {
        this.decrease(index);
      }
    });
  }

  createGoodsElements() {
    let html = "";
    this.uiData.uiGoodsList.forEach((item, index) => {
      html += ` <div class="goods-item">
      <img src="${item.goodsInfo.pic}" alt="" class="goods-pic" />
      <div class="goods-info">
        <h2 class="goods-title">${item.goodsInfo.title}</h2>
        <p class="goods-desc">
          ${item.goodsInfo.desc}
        </p>
        <p class="goods-sell">
          <span>月售 ${item.goodsInfo.sellNumber}</span>
          <span>好评率${item.goodsInfo.favorRate}%</span>
        </p>
        <div class="goods-confirm">
          <p class="goods-price">
            <span class="goods-price-unit">￥</span>
            <span>${item.goodsInfo.price}</span>
          </p>
          <div class="goods-btns">
            <i index=${index} class="iconfont i-jianhao"></i>
            <span>0</span>
            <i index=${index} class="iconfont i-jiajianzujianjiahao"></i>
          </div>
        </div>
      </div>
    </div>`;
    });

    this.doms.goodsContainer.innerHTML = html;
  }

  increase(index) {
    this.uiData.increase(index);
    this.updateGoods(index);
    this.updateFooter(index);
    this.carAnimation();
  }

  decrease(index) {
    this.uiData.decrease(index);
    this.updateGoods(index);
    this.updateFooter(index);
  }

  updateGoods(index) {
    let isChoose = this.uiData.uiGoodsList[index].isChoose();

    let choose = this.uiData.uiGoodsList[index].choose;

    let goodsDom = this.doms.goodsContainer.children[index];

    if (isChoose) {
      goodsDom.classList.add("active");
    } else {
      goodsDom.classList.remove("active");
    }

    goodsDom.querySelector(".goods-btns span").textContent = choose;
  }

  updateFooter(index) {
    //是否能起送
    let { flag, dis } = this.uiData.canDistribute();
    if (flag) {
      this.doms.footerPay.classList.add("active");
    } else {
      this.doms.footerPay.classList.remove("active");
      this.doms.footerPay.querySelector(
        "span"
      ).textContent = `还差￥${Math.round(Math.abs(dis))}元起送`;
    }

    //总计
    this.doms.footerCarTotal.textContent = Math.round(
      this.uiData.getTotalPrice()
    );

    //购物车状态
    let isChoose = this.uiData.isChoose();
    if (isChoose) {
      this.doms.footerCar.classList.add("active");
    } else {
      this.doms.footerCar.classList.remove("active");
    }
    this.doms.footerCar.querySelector(".footer-car-badge").textContent =
      this.uiData.getTotalChooseCount();
  }

  carAnimation() {
    this.doms.footerCar.classList.add("animate");
  }
}

let ui = new UI(goods);
console.log(ui);
