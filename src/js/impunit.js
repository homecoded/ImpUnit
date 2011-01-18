/*
   Copyright 2011 Manuel Rülke, http://homecoded.com

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
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
                reportError("ERROR: No Test Suite specified.");
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
