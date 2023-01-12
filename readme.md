# Website Starter

Сборка [Gulp 4](https://gulpjs.com/) для комфортного старта.

## Состав сборки:

- [babel](https://babeljs.io/) – для поддержки JS в старых браузерах;
- [terser](https://terser.org/) – сжатие и оптимизации JS;
- [cssnano](https://cssnano.co/) – сжатие и оптимизации CSS;
- [autoprefixer](https://autoprefixer.github.io/) – Установка вендорных префиксов CSS;
- [bower](https://bower.io/) – для установки необходимых библиотек в проект;
- [eslint](https://eslint.org/) – для автоматической проверки JS кода; \*
- [prettier](https://prettier.io/) – для автоматической стилизации кода. \*\*

\* _для работы eslint в vscode установите [плагин](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)_

\* \* _для работы prettier в vscode установите [плагин](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)_

## Команды

- `start` – запуск режима разработки, с отслеживанием изменений;
- `clean` – удаление каталога и архива с собранным проектом;
- `build` – сборка проекта;
- `archive` – сборка проекта с запаковкой в zip архив;
- `deploy` – публикация проекта на github pages.
