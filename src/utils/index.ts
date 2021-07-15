import moment from "moment";
export function isDebug(): Boolean {
  let argv = new Set(process.argv);
  console.log(argv);
  if (argv.has("--mode=production")) {
    return true;
  }
  return false;
}

/**
 * 格式化时间返回
 * @param time
 */
export function formatTime(time: Date): String {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
}

/**
 * 生产一个唯一的GUID
 * @returns guid
 */
export function getGUID(): string {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

/**
 * 判断对象是否存在某个值
 * @param objectData
 * @param value
 * @returns `true` | `false`
 */
export function hasObjectValue(
  objectData: any,
  value: string | number
): boolean {
  let isTrue = false;
  for (let i in objectData) {
    if (objectData[i] === value) {
      isTrue = true;
      break;
    }
  }
  return isTrue;
}

// 定义 randomNumber方法, 随机输出数组
export function randomNumber(num: number) {
  // 定义 strArr方法, 生成数组
  function strArr(num: number): Array<string> {
    var numberAarry: Array<string>;
    for (var i = 0; i < num; i++) {
      numberAarry[i] = String(i + 1);
    }
    return numberAarry;
  }
  // 获得数组
  var numberAarry = strArr(num);
  // 将数组元素随机排序
  numberAarry.sort(function () {
    return 0.5 - Math.random();
  });
  // 小于10，前面加0
  for (var i = 0; i < numberAarry.length; i++) {
    if (Number(numberAarry[i]) < 10) {
      numberAarry[i] = "0" + numberAarry[i];
    } else {
      numberAarry[i] = String(numberAarry[i]);
    }
  }
  return numberAarry;
}
