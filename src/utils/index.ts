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
  return moment(time).format("YYYY-MM-DD HH:mm:SS");
}

/**
 * 生产一个唯一的GUID
 * @returns guid
 */
export function getGUID(): string {
  function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}