import handlebars from 'handlebars';
import fs from 'fs';

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({
    file,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    // get email content from a file - template file
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    // template = content of email
    // compile = receives the string(content) as param, that contains the text and variables {{varName}}, and returns a function
    const parseTemplate = handlebars.compile(templateFileContent);

    // When we call the function returned from compile (function containing the template/content), we add the variables to tthe template
    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
