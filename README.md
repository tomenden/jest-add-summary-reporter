# jest-add-summary-reporter
A custom reporter for jest which adds a summary of failed tests at the end of the run

![jest-add-summary-reporter screenshot](https://preview.ibb.co/b4HLjd/Screen_Shot_2018_06_17_at_9_41_20.png)

## Usage
`npm i --save-dev jest-add-summary-reporter`

In your package.json or jest config file:
```js
    "reporters": [
      "default",
      "jest-add-summary-reporter"
    ]

```
