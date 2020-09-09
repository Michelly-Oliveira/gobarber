interface IMailConfig {
  driver: 'ethereal' | 'gmail';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'gobarber.gostack@gmail.com',
      name: 'GoBarber Team',
    },
  },
} as IMailConfig;
