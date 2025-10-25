import winston, { format } from 'winston';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';

const customFormat = format.combine(
  format.timestamp(),
  nestWinstonModuleUtilities.format.nestLike('MyApp', {
    prettyPrint: true,
    colors: false,
  })
);

export const winstonLogger = WinstonModule.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  transports: [new winston.transports.File({ filename: 'combined.log' })],
});
