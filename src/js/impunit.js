/*
 Copyright 2011-2015 Manuel Ruelke, http://homecoded.com

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 Check https://github.com/homecoded/ImpUnit for documentation
 */

var impunit = (function () {

    function createInstance() {
        var impunit = {}, messages = '', asyncMessages = '', isTestFailed,
            testsRun = -1, testsFailed = -1, asyncTestsFailed = [],
            silent = true, testName, currentTestContext, asyncTestTeardown = {}, isAsyncTest,
            asyncTestsRun = [], asyncCb = null, asyncTestsInProgress = {},
            uniqueId = 0;

        // private function to report an error
        function reportError(msg, asyncTestName) {
            isTestFailed = true;
            if (asyncTestName) {
                asyncMessages += 'ASYNC TEST (' + asyncTestName + '):\n' + msg + '\n\n';
                if (asyncTestsFailed.indexOf(asyncTestName) < 0) {
                    asyncTestsFailed.push(asyncTestName);
                }
                if (asyncCb) {
                    asyncCb();
                }
            } else {
                messages += msg + '\n\n';
            }
            if (!silent) {
                alert(msg);
            }
        }

        function runSingleTest(testSuite, setupMethod, tearDownMethod) {
            uniqueId++;
            isTestFailed = false;
            testsRun += 1;
            currentTestContext = testSuite;
            isAsyncTest = false;
            setupMethod.call(currentTestContext);
            testSuite[testName].call(currentTestContext);
            if (isAsyncTest) {
                asyncTestTeardown[testName + uniqueId] = tearDownMethod;
            } else {
                tearDownMethod.call(currentTestContext);
            }
            if (isTestFailed) {
                testsFailed += 1;
            }
        }

        function runSuiteTest(testSuite, test) {
            var setupMethod = (testSuite._setup) ? testSuite._setup : function () {
            };
            var tearDownMethod = (testSuite._teardown) ? testSuite._teardown : function () {
            };

            if (testSuite.hasOwnProperty(test)) {
                testName = test;
                try {
                    if (typeof (testSuite[testName]) === 'function' && testName.indexOf('_test') === 0) {
                        runSingleTest(testSuite, setupMethod, tearDownMethod);
                    }
                } catch (e) {
                    testsFailed += 1;
                    reportError('TEST FAILED\nTest Name: ' + testName + '\nError: ' + e);
                    if (tearDownMethod) {
                        tearDownMethod.call(currentTestContext);
                    }
                }
            }
        }

        // run the tests in a test container
        impunit.runTests = function (testSuites) {
            if (!testSuites) {
                reportError('ERROR: No Test Suite specified.');
            }

            if (!(testSuites instanceof Array)) {
                testSuites = [testSuites];
            }

            var test;
            testsRun = 0;
            testsFailed = 0;
            asyncTestsFailed = [];
            asyncTestsRun = [];
            asyncTestTeardown = {};
            messages = '';

            var numTestSuites = testSuites.length;
            for (var i = 0; i < numTestSuites; i++) {
                var testSuite = testSuites[i];

                for (test in testSuite) {
                    runSuiteTest(testSuite, test);
                }
            }
        };

        function assert(expr, testIdent, msg, asyncTestName) {
            if (expr === false) {
                reportError('TEST FAILED\nTest Name: ' + testName + '\n' + testIdent + ': ' + msg,
                    asyncTestName);
            }
            if (asyncTestName && asyncCb) {
                if (asyncTestsRun.indexOf(asyncTestName) < 0) {
                    asyncTestsRun.push(asyncTestName);
                }
                asyncCb();
            }
        }

        impunit.assertTrue = function (boolExpr, msg) {
            assert(boolExpr, 'assertTrue', msg, impunit.assertTrue.caller.testName);
        };

        impunit.assertEqual = function (exp1, exp2, msg) {
            assert(exp1 === exp2, 'assertEqual (' + exp1 + ') != (' + exp2 + ')', msg, impunit.assertEqual.caller.testName);
        };

        impunit.messages = function () {
            return messages;
        };
        impunit.asyncMessages = function () {
            return asyncMessages;
        };
        impunit.testsFailed = function () {
            return testsFailed;
        };
        impunit.asyncTestsFailed = function () {
            return asyncTestsFailed.length;
        };
        impunit.testsRun = function () {
            return testsRun;
        };
        impunit.asyncTestsRun = function () {
            return asyncTestsRun.length;
        };

        impunit.silent = function (value) {
            if (arguments.length > 0) {
                silent = (value) ? true : false;
            }
            return silent;
        };

        impunit.onAsyncTestFailed = function (callback) {
            if (arguments.length > 0 && typeof callback === 'function') {
                asyncCb = callback;
            }
            return asyncCb;
        };

        impunit.asyncCallback = function (callback) {
            isAsyncTest = true;
            var context = currentTestContext;
            callback.testName = testName;
            callback.id = uniqueId;

            var callbackWrapper = function () {
                var testName = callback.testName;
                if (asyncTestsInProgress[testName + callback.id]) {
                    var index = asyncTestsInProgress[testName + callback.id].indexOf(callback);
                    asyncTestsInProgress[testName + callback.id].splice(index, 1);
                }
                callback.apply(context, arguments);
                if (!asyncTestsInProgress[testName + callback.id] ||
                    asyncTestsInProgress[testName + callback.id].length === 0)
                {
                    if (asyncTestTeardown[testName + callback.id]) {
                        asyncTestTeardown[testName + callback.id].call(context);
                    }
                }
            };
            if (!asyncTestsInProgress[testName + callback.id]) {
                asyncTestsInProgress[testName + callback.id] = [];
            }
            asyncTestsInProgress[testName + callback.id].push(callback);
            return callbackWrapper;
        };

        return impunit;
    }

    var impunit = createInstance();
    impunit.createInstance = createInstance;
    return impunit;
}());
