export function isDebug() {
  let argv = new Set(process.argv);
  console.log(argv);
  if (argv.has("--mode=production")) {
    return true;
  }
  return false;
  return;
}
