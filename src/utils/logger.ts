import log from 'loglevel';
import chalk, { ChalkInstance } from 'chalk';
import prefix from 'loglevel-plugin-prefix';

interface ColorsType {
  [key: string]: ChalkInstance;
}

const colors: ColorsType = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
};

if (process.env.NODE_ENV == 'development') {
  log.setLevel('debug');
}

prefix.reg(log);

prefix.apply(log, {
  format(level, name, timestamp) {
    const color = colors[level.toUpperCase()];
    let levelColored = level;
    if (color) {
      levelColored = color(level);
    }
    return `${chalk.gray(`[${timestamp}]`)} ${levelColored} ${chalk.green(
      `${name}:`,
    )}`;
  },
});

export { log as logger };
