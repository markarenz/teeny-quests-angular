export const logger = ({
  message,
  type,
}: {
  message: string;
  type: string;
}) => {
  switch (type) {
    case 'error':
      console.error(message);
      break;
    case 'warn':
      console.warn(message);
      break;
    case 'info':
      console.info(message);
  }
};
