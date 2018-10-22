<p align="center">
    <img src="doc/resources/Icon.svg" width="200"/>
</p>

# QLOCKGENERATOR
[![contributions welcome](https://img.shields.io/badge/Ionic-v4-3880ff.svg)](https://beta.ionicframework.com/docs)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-green.svg)](https://github.com/SimonGolms/QLOCKGENERATOR/issues)
[![Maintainability](https://api.codeclimate.com/v1/badges/d3da8203df839ea0fda2/maintainability)](https://codeclimate.com/github/SimonGolms/QLOCKGENERATOR/maintainability)
[![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SYPW37BHKX4ZA)

Generate your own front for your selfmade word clock.

## Featues

- **Variants** - Many pre-configured fronts for the appropriate DIY kits
- **Export** - Export your generated front in the formats of SVG, DXF, PDF and PNG. Furthermore the additional options of a mirror inverted and / or outline version are also possible.
- **Matrix**
    - **Placement** - Free placement and size of the grid while maintaining the consistent positioning of each letter.
    - **Languages** - Many predefined language packs to choose from, which can easily be changed to your own wishes / slang.
    - **Fonts** - Simple, Modern, Shrill, Gothic, Classic or Klingon there is something for everyone. If not you can simply add your own font. (*Hint*: Only "Stencil" - fonts are also useful for a DXF export).
- **Branding** -  Give the front a personal signature or name.
- **Minutes** - Free placement and size of the minutes while keeping the symmetrical distances.
- **Alarm** - Selection of different alarm symbols for free placement, if the front ist for a word clock with an alarm clock function.
- **Color** - Just type in the [HEX](https://www.color-hex.com/) color values and get a preview of how it might look like later.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Please make sure latest Node 6 LTS and NPM 3+ are installed and install the Ionic CLI globally.
```Shell
$ npm install -g ionic@latest
```
 For more information and assistance, see: [Ionic Framework - Getting Started](https://ionicframework.com/docs/cli/)

### Installing

Clone or download the latest version of the project:
```Shell
$ git clone https://github.com/SimonGolms/QLOCKGENERATOR
$ cd QLOCKGENERATOR
```
Install all the local dependencies:
```Shell
$ npm install
```
Start a local dev server for app dev/testing:
```Shell
$ ionic serve
```

## Add your own font

1. Add your font e.g. `MyOwnFont.ttf` in TrueType format to the folder `src/app/assets/fonts/`.
2. To ensure that the font can be used later during the generation, a new entry with the following structure must be added to the file `src/app/services/fonts.service.ts` in the variable `_fonts`:
    ```javascript
    {
        id: "30000",
        label: "MyOwnFont",
        category: FontCategory.REGULAR,
        filename: "MyOwnFont.ttf",
        path: this.DIRECTORY,
    }
    ```
3. To see the font already as a preview in the font selection, a new font-family entry has to be added to the `fonts.css` file under `src/app/assets/fonts/`.

## Built With

* [**Ionic**](https://ionicframework.com) - The used web framework
* [**maker.js**](https://maker.js.org) - Javascript library for creating modular line drawings
* [**opentype.js**](https://opentype.js.org) - OpenType and TrueType font parser and writer
* [**PDFKit**](http://pdfkit.org/) - A JavaScript PDF generation library for Node and the browser.


## Contributing

If you want to contribute to a project and make it better, your help is very welcome. Contributing is also a great way to learn more about social coding on Github, new technologies and and their ecosystems and how to make constructive, helpful bug reports, feature requests and the noblest of all contributions: a good, clean pull request.
* Create a personal fork of the project.
* Create a new branch to work on! Branch from develop if it exists, else from master.
* Implement/fix your feature, comment your code.
* Add or change the documentation as needed.
* From your fork open a pull request in the correct branch


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
