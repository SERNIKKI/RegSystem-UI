/**
 * 雪花 ID 生成器
 * @description js Number 最大长度不超过 17 位，否则会出现精度丢失的问题
 */
class SnowflakeID {
  constructor(options) {
    options = options || {};
    this.seq = 0;
    //机器 id 或任何随机数。如果您是在分布式系统中生成 id，强烈建议您提供一个适合不同机器的 mid。
    this.mid = (options.mid || 1) % 1023;
    //这是一个时间偏移量，它将从当前时间中减去以获得 id 的前 42 位。这将有助于生成更小的 id。
    this.offset = options.offset || (new Date().getFullYear() - 1970) * 31536000 * 1000;
    this.lastTime = 0;
  }

  generate() {
    const time = Date.now();
    const bTime = (time - this.offset).toString(2);
    // get the sequence number
    if (this.lastTime == time) {
      this.seq++;
      if (this.seq > 4095) {
        this.seq = 0;
        // make system wait till time is been shifted by one millisecond
        while (Date.now() <= time) {
        }
      }
    } else {
      this.seq = 0;
    }

    this.lastTime = time;

    let bSeq = this.seq.toString(2);
    let bMid = this.mid.toString(2);

    // create sequence binary bit
    while (bSeq.length < 12) bSeq = '0' + bSeq;

    while (bMid.length < 10) bMid = '0' + bMid;

    const bid = bTime + bMid + bSeq;
    let id = '';
    for (let i = bid.length; i > 0; i -= 4) {
      id = parseInt(bid.substring(i - 4, i), 2).toString(16) + id;
    }
    return this.hexToDec(id);
  }

  add(x, y, base) {
    let z = [];
    let n = Math.max(x.length, y.length);
    let carry = 0;
    let i = 0;
    while (i < n || carry) {
      let xi = i < x.length ? x[i] : 0;
      let yi = i < y.length ? y[i] : 0;
      let zi = carry + xi + yi;
      z.push(zi % base);
      carry = Math.floor(zi / base);
      i++;
    }
    return z;
  }

  /**
   * 乘以数字
   * @param {*} num
   * @param {*} x
   * @param {*} base
   */
  multiplyByNumber(num, x, base) {
    if (num < 0) return null;
    if (num == 0) return [];

    let result = [];
    let power = x;
    while (true) {
      if (num & 1) {
        result = this.add(result, power, base);
      }
      num = num >> 1;
      if (num === 0) break;
      power = this.add(power, power, base);
    }

    return result;
  }

  /**
   * 解析为数组
   * @param {*} str
   * @param {*} base
   */
  parseToDigitsArray(str, base) {
    let digits = str.split('');
    let ary = [];
    for (let i = digits.length - 1; i >= 0; i--) {
      let n = parseInt(digits[i], base);
      if (isNaN(n)) return null;
      ary.push(n);
    }
    return ary;
  }

  /**
   * 转换
   * @param {*} str
   * @param {*} fromBase
   * @param {*} toBase
   */
  convertBase(str, fromBase, toBase, legnth) {
    let digits = this.parseToDigitsArray(str, fromBase);
    if (digits === null) return null;
    let outArray = [];
    let power = [1];
    for (let i = 0; i < digits.length; i++) {
      // inletiant: at this point, fromBase^i = power
      if (digits[i]) {
        outArray = this.add(
          outArray,
          this.multiplyByNumber(digits[i], power, toBase),
          toBase
        );
      }
      power = this.multiplyByNumber(fromBase, power, toBase);
    }
    let out = '';
    //设置了这里-3 会返回 16 位的字符，如果是设置为 outArray.length - 1 会返回 18 位的字符
    for (let i = outArray.length - 3; i >= 0; i--) {
      out += outArray[i].toString(toBase);
    }
    return out;
  }

  /**
   * 16 进制=> 10 进制
   * @param {*} hexStr
   */
  hexToDec(hexStr) {
    if (hexStr.substring(0, 2) === '0x') hexStr = hexStr.substring(2);
    hexStr = hexStr.toLowerCase();
    return this.convertBase(hexStr, 16, 10);
  }
}

//下面是测试代码部分，不需要的可以直接移除
// const snid = new SnowflakeID({
//   mid: +new Date()
// });
// let id = snid.generate();
// console.log(id, id.length);
// let arr = [];
// for (let index = 0; index < 10000; index++) {
//   id = snid.generate();
//   console.log(id);
//   arr.push(snid.generate(), +new Date());
// }
export default SnowflakeID
