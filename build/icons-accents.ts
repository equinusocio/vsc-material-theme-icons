import * as fs from 'fs';
import * as path from 'path';
import {IThemeIconsAccents, IThemeIconsItem} from '../typings/interfaces/icons';
import {getDefaultsJson} from '../src/helpers/fs';
import {PATHS} from './helpers/paths';

const ICON_VARIANTS_BASE_PATH: string = path.join(process.cwd(), PATHS.pathIcons);
const DEFAULTS = getDefaultsJson();

const normalizeIconPath = (iconPath: string): string =>
  path.join(process.cwd(), PATHS.icons, iconPath);

const replaceNameWithAccent = (name: string, accentName: string): string =>
  name.replace('.svg', `.accent.${ accentName }.svg`);

const replaceSVGColour = (filecontent: string, colour: string): string =>
  filecontent.replace(new RegExp('#(80CBC4)', 'i'), ($0, $1) => {
    const newColour = colour.replace('#', '');
    console.log(`Replacing colour ${ $1 } with ${ newColour }`);
    return $0.replace($1, newColour);
  });

const replaceWhiteSpaces = (input: string): string =>
  input.replace(/\s+/g, '-');

const writeSVGIcon = (fromFile: string, toFile: string, accent: string): void => {
  const fileContent: string = fs.readFileSync(normalizeIconPath(fromFile), 'utf-8');
  const content: string = replaceSVGColour(fileContent, DEFAULTS.accents[accent]);
  const pathToFile = normalizeIconPath(toFile);
  console.log(`Accented icon ${pathToFile} created with colour ${ accent } (${ DEFAULTS.accents[accent] })`);
  fs.writeFileSync(pathToFile, content);
};

export default () => {
  const basetheme: IThemeIconsAccents = require(ICON_VARIANTS_BASE_PATH);

  Object.keys(DEFAULTS.accents).forEach(key => {
    const iconName = replaceWhiteSpaces(key);
    const themecopy: IThemeIconsAccents = JSON.parse(JSON.stringify(basetheme));
    const variantPath: string = PATHS.pathIconKey(key);

    DEFAULTS.accentableIcons.forEach(accentableIconName => {
      console.log(`Preparing ${accentableIconName} accented icon`);
      const iconOriginDefinition: IThemeIconsItem = (basetheme.iconDefinitions as any)[accentableIconName];
      const iconCopyDefinition: IThemeIconsItem = (themecopy.iconDefinitions as any)[accentableIconName];

      if (iconOriginDefinition !== undefined && typeof iconOriginDefinition.iconPath === 'string' && iconCopyDefinition !== undefined && typeof iconCopyDefinition.iconPath === 'string') {
        iconCopyDefinition.iconPath = replaceNameWithAccent(iconOriginDefinition.iconPath, iconName);
        writeSVGIcon(iconOriginDefinition.iconPath, iconCopyDefinition.iconPath, key);
      } else {
        console.log(`Icon ${accentableIconName} not found`);
      }
    });

    console.log('Accentable icons generated', variantPath);
    return Promise.resolve();
  });
};
