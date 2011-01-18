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

_testGlobalTest = function () {
    impunit.assertTrue(true);
}

var runTests = function () {

    function getImpUnitTestInstance() {
        var iuClone = impunit.createInstance();
        iuClone.silent(true);
        return iuClone;
    }

    function reportResult() {
        var result = "<h1>Testing done!</h1>"
                + "<p>Tests run: " + impunit.testsRun() + "<br>"
                + "Tests failed: " + impunit.testsFailed() + "</p>"
                + "<p><pre>" + impunit.messages() + "</pre></p>";

        var results = document.getElementById('results');
        results.innerHTML = result;
        results.style.color = (impunit.testsFailed() > 0) ? "#880000" : "#008800";
    }

    //  test suite
    var testSuite = {
        _testInit : function _testInit(){
            var testImpUnit = getImpUnitTestInstance();
            impunit.assertTrue(testImpUnit.testsRun() <= 0);
            impunit.assertTrue(testImpUnit.testsFailed() <= 0);
        },
        _testInstanceIndependence : function () {
            var testImpUnit = getImpUnitTestInstance();
            var testImpUnit2 = getImpUnitTestInstance();
            testImpUnit2.silent(true);
            testImpUnit.silent(false);
            impunit.assertTrue(testImpUnit.silent() !== testImpUnit2.silent(), "silent is different" );

            testImpUnit2.assertTrue(false);
            impunit.assertTrue(testImpUnit2.messages().length > 0, "testImpUnit2 has messages");
            impunit.assertTrue(testImpUnit.messages().length === 0, "testImpUnit has no messages");
        },

        _testNoFailNoMessage : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertTrue(true, "test");
            impunit.assertEqual("", testImpUnit.messages(), "test");
        },

        _testFailHasMessage : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertTrue(false, "test2");
            impunit.assertTrue(testImpUnit.messages().length > 0, "test");
        },

        _testAssertTrue : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertTrue(true);
            impunit.assertTrue(testImpUnit.messages().length === 0);
            testImpUnit.assertTrue(false);
            impunit.assertTrue(testImpUnit.messages().length > 0);
        },

        _testAssertEqual : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertEqual(0, 0);
            testImpUnit.assertEqual(12, 12);
            testImpUnit.assertEqual(-12, -12);
            testImpUnit.assertEqual(12, 12);
            testImpUnit.assertEqual("", "");
            testImpUnit.assertEqual(null, null);
            testImpUnit.assertEqual(undefined, undefined);
            var a,b;
            testImpUnit.assertEqual(a, b);
            testImpUnit.assertEqual(a, undefined);
            a = b = {};
            testImpUnit.assertEqual(a, b);
            a = b = [];
            testImpUnit.assertEqual(a, b);
            impunit.assertTrue(testImpUnit.messages().length === 0);
        },

        _testAssertEqualFailCase1 : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertEqual("0", 0);
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testAssertEqualFailCase2 : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertEqual(1, 0);
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testAssertEqualFailCase3 : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertEqual("0", "1");
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testAssertEqualFailCase4 : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertEqual(null, undefined);
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testAssertEqualFailCase5 : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertEqual(null, undefined);
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testAssertEqualFailCase6 : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertEqual("null", null);
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testAssertEqualFailCase7 : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.assertEqual(1, -1);
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testAssertEqualFailCase8 : function () {
            var testImpUnit = getImpUnitTestInstance();
            var a = {}, b = {};
            testImpUnit.assertEqual(a, b);
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testAssertEqualFailCase9 : function () {
            var testImpUnit = getImpUnitTestInstance();
            var a = [], b = [];
            testImpUnit.assertEqual(a, b);
            impunit.assertTrue(testImpUnit.messages().length !== 0);
        },

        _testRunTestSuite : function () {
            var testImpUnit = getImpUnitTestInstance();
            var testSuite = {
                _test1 : function () {
                    testImpUnit.assertTrue(true);
                },

                _test2 : function () {
                    testImpUnit.assertTrue(true);
                    testImpUnit.assertTrue(true);
                    testImpUnit.assertTrue(true);
                },

                _test3 : function () {
                    testImpUnit.assertEqual(12, 12);
                }
            };
            testImpUnit.runTests(testSuite);
            impunit.assertEqual(3, testImpUnit.testsRun());
            impunit.assertEqual(0, testImpUnit.testsFailed());
        },

        _testRunTestSuiteFail : function () {
            var testImpUnit = getImpUnitTestInstance();
            var testSuite = {
                _test1 : function () {
                    testImpUnit.assertTrue(false);
                }
            };
            testImpUnit.runTests(testSuite);
            impunit.assertEqual(1, testImpUnit.testsRun());
            impunit.assertEqual(1, testImpUnit.testsFailed());
        },

        _testRunTestMultipleSuites : function () {
            var testImpUnit = getImpUnitTestInstance();
            var testSuiteError = {
                _test1 : function () {
                    testImpUnit.assertTrue(false);
                }
            };
            var testSuiteOk = {
                _test1 : function () {
                    testImpUnit.assertTrue(true);
                }
            };
            var testSuiteOk2 = {
                _test1 : function () {
                    testImpUnit.assertTrue(true);
                    testImpUnit.assertTrue(true);
                }
            };

            testImpUnit.runTests(testSuiteOk);
            impunit.assertEqual(1, testImpUnit.testsRun());
            impunit.assertEqual(0, testImpUnit.testsFailed());
            impunit.assertTrue(testImpUnit.messages().length === 0);

            testImpUnit.runTests(testSuiteError);
            impunit.assertEqual(1, testImpUnit.testsRun());
            impunit.assertEqual(1, testImpUnit.testsFailed());
            impunit.assertTrue(testImpUnit.messages().length !== 0);

            testImpUnit.runTests(testSuiteOk2);
            impunit.assertEqual(1, testImpUnit.testsRun());
            impunit.assertEqual(0, testImpUnit.testsFailed());
            impunit.assertTrue(testImpUnit.messages().length === 0);
        },

        _testRunTestSuiteMultipleFail : function () {
            var testImpUnit = getImpUnitTestInstance();
            var testSuiteError = {
                _test1 : function () {
                    testImpUnit.assertTrue(false);
                }
            };

            var testSuite2Errors = {
                _test1 : function () {
                    testImpUnit.assertTrue(false);
                },
                _test2 : function () {
                    testImpUnit.assertTrue(false);
                }
            };

            testImpUnit.runTests(testSuiteError);
            impunit.assertEqual(1, testImpUnit.testsRun());
            impunit.assertEqual(1, testImpUnit.testsFailed());

            testImpUnit.runTests(testSuite2Errors);
            impunit.assertEqual(2, testImpUnit.testsRun());
            impunit.assertEqual(2, testImpUnit.testsFailed());
        },

        _testExceptionFail : function () {
            var testImpUnit = getImpUnitTestInstance();
            var testSuiteError = {
                _test1 : function () {
                    throw "Some custom error";
                },
                _test2 : function () {
                    var s;
                    s.undefinedFunction();
                }
            };
            testImpUnit.runTests(testSuiteError);
            impunit.assertEqual(2, testImpUnit.testsFailed());
            impunit.assertEqual(2, testImpUnit.testsRun());
        },

        _testErrorMessageAccumulation : function () {
            var testImpUnit = getImpUnitTestInstance();
            var testSuiteError = {
                _test1 : function () {
                    testImpUnit.assertTrue(false);
                }
            };
            var testSuiteError2 = {
                _test1 : function () {
                    testImpUnit.assertTrue(false);
                },
                _test2 : function () {
                    testImpUnit.assertTrue(false);
                }
            };

            testImpUnit.runTests(testSuiteError);
            var msgLen1 = testImpUnit.messages().length;
            testImpUnit.runTests(testSuiteError2);
            var msgLen2 = testImpUnit.messages().length;

            impunit.assertTrue(msgLen1 < msgLen2);
        },

        _testGlobalNamespace : function () {
            var testImpUnit = getImpUnitTestInstance();
            testImpUnit.runTests();
            impunit.assertEqual(1, testImpUnit.testsRun());
        }
    };

    // run the tests
    impunit.runTests(testSuite);
    if (impunit.testsRun() <= 0) {
        alert("ERR: No tests were run!");
    } else {
        reportResult();
    }
};
