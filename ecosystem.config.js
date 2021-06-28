module.exports = {
  apps: [{
    name: 'JMLotto',
    script: './dist/src/server.js',
    error_file: "./pm2logs/app-err.log",
    out_file: "./pm2logs/app-out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    ignore_watch: ['node_modules'],
    env: {
      NODE_ENV: "development", // 环境参数，当前指定为本地环境 process.env.NODE_ENV
      //启动命令命令 pm2 start ecosystem.config.js
    },
    env_production: {
      NODE_ENV: "production", // 环境参数，当前指定为开发环境 process.env.NODE_ENV
      //启动命令命令 pm2 start ecosystem.config.js --env production
    },
  }]
};