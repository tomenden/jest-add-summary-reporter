const { relative } = require("path");
const _ = require("lodash");
const chalk = require("chalk");

const TESTS_KEY = "@@TEST_KEY@@";
const FAILED_TEST_STATUS = "failed";

const style = {
  file: chalk.bold.white,
  title: chalk.grey,
  describe: chalk.white,
  heading: chalk.bold.cyan.underline,
  failedSuites: chalk.yellow,
  failedTests: chalk.red
};

const redX = chalk.red("✕");
const INDENT = "  ";

class AddSummaryReporter {
  constructor({ rootDir }) {
    this.rootDir = rootDir;
  }

  generateTestTree(tests) {
    if (tests.length === 0) return;

    const tree = _(_.cloneDeep(tests))
      .groupBy(
        test =>
          test.ancestorTitles.length > 0
            ? test.ancestorTitles.shift()
            : TESTS_KEY
      )
      .value();
    return _.mapValues(tree, (value, key) => {
      if (key === TESTS_KEY) return value;
      return this.generateTestTree(value);
    });
  }

  logTestTree(tree, indentLevel = 0) {
    _.forEach(tree, (childTree, key) => {
      if (key === TESTS_KEY) {
        _.forEach(childTree, test =>
          console.log(
            `${INDENT.repeat(indentLevel)}${redX} ${style.title(test.title)}`
          )
        );
      } else {
        console.log(`${INDENT.repeat(indentLevel)}${style.describe(key)}`);
        this.logTestTree(childTree, indentLevel + 1);
      }
    });
  }

  onRunComplete(contexts, results) {
    const { numFailedTestSuites, numFailedTests, testResults } = results;
    if (numFailedTests === 0) {
      return;
    }

    console.log(style.heading(`Failed tests summary:`));

    for (let testFile of testResults) {
      const failedTests = testFile.testResults.filter(
        t => t.status == FAILED_TEST_STATUS
      );
      if (failedTests.length === 0) {
        continue;
      }

      console.log(style.file(relative(this.rootDir, testFile.testFilePath)));
      const failedTestsTree = this.generateTestTree(failedTests);
      this.logTestTree(failedTestsTree);
    }
    console.log(style.failedSuites(`Failed Suites: ${numFailedTestSuites}`));
    console.log(style.failedTests(`Failed Tests: ${numFailedTests}`));
  }
}

module.exports = AddSummaryReporter;
