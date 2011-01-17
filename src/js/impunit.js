/**
 * ImpUnit us a very very tiny unit testing framework
 */

var impunit = (function () {

    function createInstance() {

        var impunit = {}, messages = "", isTestFailed, testsRun = -1, testsFailed = -1, silent = true, testName;

        // privat function to report an error
        function reportError(msg) {
            isTestFailed = true;
            messages += msg + "\n\n";
            if (!silent) {
                alert(msg);
            }
        }

        // run the tests in a test container
        impunit.runTests = function (testSuite) {
            if (!testSuite) {
                testSuite = window;
            }

            testsRun = 0;
            testsFailed = 0;
            messages = "";

            for (testName in testSuite) {
                if (testSuite.hasOwnProperty(testName)) {
                    try {
                        if (typeof (testSuite[testName]) === "function" && testName.indexOf("_test") === 0) {
                            isTestFailed = false;
                            testsRun += 1;
                            testSuite[testName]();
                            if (isTestFailed) {
                                testsFailed += 1;
                            }
                        }
                    } catch (e) {
                        testsFailed += 1;
                        reportError("TEST FAILED\nTest Name: " + testName + "\nError: " + e);
                    }
                }
            }
        };

        impunit.assertTrue = function (boolExpr, msg)	{
            if (boolExpr === false) {
                reportError("TEST FAILED\nTest Name: " + testName + "\nassertTrue: " + msg);
            }
        };

        impunit.assertEqual = function (exp1, exp2, msg) {
            if (exp1 !== exp2) {
                reportError("TEST FAILED\nTest Name: " + testName + "\n\nassertEqual <" + exp1 + "> != <" + exp2 + ">\n" + msg);
            }
        };

        impunit.messages = function () { return messages; };
        impunit.testsFailed = function () { return testsFailed; };
        impunit.testsRun = function () { return testsRun; };

        impunit.silent = function (value) {
            if (arguments.length > 0) {
                silent = (value) ? true : false;
            }
            return silent;
        };

        return impunit;
    }

    var impunit = createInstance();
    impunit.createInstance = createInstance;
    return impunit;
}());