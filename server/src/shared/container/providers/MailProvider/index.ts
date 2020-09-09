import { container } from 'tsyringe';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import GmailMailProvider from './implementations/GmailMailProvider';

import mailConfig from '@config/mail';
import IMailProvider from './models/IMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  gmail: container.resolve(GmailMailProvider),
};

// Use registerInstance to be albe to use the constructor; it is also a singleton, we create an instance the will be reused everytime the dependency is called
// Use container.resolve to inject the necessary dependencies
container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
