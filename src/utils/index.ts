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
